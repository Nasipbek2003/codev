import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAdminTelegramIds } from '../../../lib/database';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      fullName,
      whatsapp,
      institution,
      direction,
      service,
      deadline,
      expectedPrice,
      withWebsite,
      description
    } = data;

    // Валидация обязательных полей
    if (!fullName || !whatsapp || !institution || !direction || !service || !deadline || !expectedPrice) {
      return NextResponse.json(
        { error: 'Все обязательные поля должны быть заполнены' },
        { status: 400 }
      );
    }

    // Сохраняем в базу данных
    const studentRequest = await prisma.studentRequest.create({
      data: {
        fullName,
        whatsapp,
        institution,
        direction,
        service,
        deadline,
        expectedPrice,
        withWebsite: withWebsite || false,
        description: description || null
      }
    });

    // Отправляем в Telegram
    await sendToTelegram(data);

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

  // Формируем сообщение
  const message = `
🎓 <b>Новая заявка от студента!</b>

👤 <b>ФИО:</b> ${data.fullName}
📱 <b>WhatsApp:</b> ${data.whatsapp}

🏫 <b>Учебное заведение:</b> ${data.institution}
📚 <b>Направление:</b> ${data.direction}

📝 <b>Услуга:</b> ${data.service}
📅 <b>Срок сдачи:</b> ${data.deadline}
💰 <b>Ожидаемая цена:</b> ${data.expectedPrice} KGS
🌐 <b>С сайтом:</b> ${data.withWebsite ? 'Да' : 'Нет'}

${data.description ? `📄 <b>Описание:</b>\n${data.description}` : ''}

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
