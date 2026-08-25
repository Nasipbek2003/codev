import { NextRequest, NextResponse } from 'next/server';
import { getAdminTelegramIds } from '../../../lib/database';
// Используем общий синглтон: свой new PrismaClient() создавал
// отдельный пул коннекшенов на каждый инстанс роута
import { prisma } from '../../../lib/prisma';
import { rateLimit, getClientIp } from '../../../lib/rate-limit';
import {
  sanitizeString,
  isPlausiblePhone,
  escapeHtml,
  FIELD_LIMITS
} from '../../../lib/validation';

/** Заявки студентов: пишутся в БД и уходят в Telegram, нужен потолок на спам */
const RATE_LIMIT = { requests: 5, windowMs: 10 * 60 * 1000 };

export async function POST(request: NextRequest) {
  // Без лимита любой может залить таблицу и завалить админов сообщениями
  const ip = getClientIp(request);
  const limit = rateLimit(`student-request:${ip}`, RATE_LIMIT.requests, RATE_LIMIT.windowMs);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Слишком много заявок. Попробуйте позже.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const data = await request.json();

    // Нормализуем и обрезаем по длине: раньше проверялась только непустота,
    // и в БД могла уехать строка любого размера
    const fullName = sanitizeString(data?.fullName, FIELD_LIMITS.name);
    const whatsapp = sanitizeString(data?.whatsapp, FIELD_LIMITS.phone);
    const institution = sanitizeString(data?.institution, FIELD_LIMITS.shortText);
    const direction = sanitizeString(data?.direction, FIELD_LIMITS.shortText);
    const service = sanitizeString(data?.service, FIELD_LIMITS.shortText);
    const deadline = sanitizeString(data?.deadline, FIELD_LIMITS.shortText);
    const expectedPrice = sanitizeString(data?.expectedPrice, FIELD_LIMITS.shortText);
    const description = sanitizeString(data?.description, FIELD_LIMITS.longText);
    const withWebsite = data?.withWebsite === true;

    // Валидация обязательных полей
    if (!fullName || !institution || !direction || !service || !deadline || !expectedPrice) {
      return NextResponse.json(
        { error: 'Все обязательные поля должны быть заполнены' },
        { status: 400 }
      );
    }

    if (!isPlausiblePhone(whatsapp)) {
      return NextResponse.json(
        { error: 'Некорректный номер телефона' },
        { status: 400 }
      );
    }

    const payload = {
      fullName,
      whatsapp,
      institution,
      direction,
      service,
      deadline,
      expectedPrice,
      withWebsite,
      description: description || null
    };

    // Сохраняем в базу данных
    const studentRequest = await prisma.studentRequest.create({ data: payload });

    // Отправляем в Telegram
    await sendToTelegram(payload);

    return NextResponse.json({ success: true, id: studentRequest.id });
  } catch (error) {
    console.error('Error processing student request:', error);
    return NextResponse.json(
      { error: 'Ошибка при обработке заявки' },
      { status: 500 }
    );
  }
}

async function sendToTelegram(data: any) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    console.log('Telegram bot token not configured, skipping Telegram send...');
    return;
  }

  // Получаем список админских Telegram ID из базы данных (используем ту же функцию что и калькулятор)
  const adminIds = await getAdminTelegramIds();

  if (adminIds.length === 0) {
    console.log('No admin Telegram IDs found in database, skipping Telegram send...');
    return;
  }

  console.log(`Отправляем уведомления ${adminIds.length} администраторам:`, adminIds);

  // Сообщение уходит с parse_mode HTML, поэтому весь пользовательский ввод
  // экранируем: иначе теги из полей формы станут разметкой у администратора
  const message = `
🎓 <b>Новая заявка от студента!</b>

👤 <b>ФИО:</b> ${escapeHtml(data.fullName)}
📱 <b>WhatsApp:</b> ${escapeHtml(data.whatsapp)}

🏫 <b>Учебное заведение:</b> ${escapeHtml(data.institution)}
📚 <b>Направление:</b> ${escapeHtml(data.direction)}

📝 <b>Услуга:</b> ${escapeHtml(data.service)}
📅 <b>Срок сдачи:</b> ${escapeHtml(data.deadline)}
💰 <b>Ожидаемая цена:</b> ${escapeHtml(data.expectedPrice)} KGS
🌐 <b>С сайтом:</b> ${data.withWebsite ? 'Да' : 'Нет'}

${data.description ? `📄 <b>Описание:</b>\n${escapeHtml(data.description)}` : ''}

⏰ <b>Дата заявки:</b> ${new Date().toLocaleString('ru-RU')}
  `.trim();

  // Отправляем всем администраторам
  const sendPromises = adminIds.map(async (adminId) => {
    try {
      console.log(`Отправляем сообщение администратору ${adminId}...`);

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: adminId,
          text: message,
          parse_mode: 'HTML'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Ошибка отправки администратору ${adminId}:`, errorText);
        return { adminId, success: false, error: 'Failed to send message' };
      }

      console.log(`✅ Успешно отправлено администратору ${adminId}`);
      return { adminId, success: true };

    } catch (error: any) {
      console.error(`Ошибка отправки администратору ${adminId}:`, error);
      return { adminId, success: false, error: error.message };
    }
  });

  // Ждем результатов отправки всем администраторам
  const results = await Promise.all(sendPromises);

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  console.log(`Результаты отправки: ${successCount} успешно, ${failureCount} ошибок`);

  if (failureCount > 0) {
    const failedAdmins = results.filter(r => !r.success).map(r => r.adminId);
    console.warn('Не удалось отправить администраторам:', failedAdmins);
  }

  // Если хотя бы одному администратору отправили, считаем это успехом
  if (successCount === 0) {
    throw new Error('Failed to send to any admin');
  }
}
