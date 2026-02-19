import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupAdminIds() {
  try {
    console.log('🔧 Настройка admin_telegram_ids в базе данных...');

    // Проверяем, существует ли уже запись
    const existingSetting = await prisma.setting.findUnique({
      where: { key: 'admin_telegram_ids' }
    });

    if (existingSetting) {
      console.log('✅ Запись admin_telegram_ids уже существует:', existingSetting.value);
      console.log('Если хотите изменить, обновите запись в базе данных вручную.');
      return;
    }

    // Получаем Telegram ID из переменной окружения или используем пустой массив
    const telegramId = process.env.ADMIN_TELEGRAM_ID || '';
    const adminIds = telegramId ? [telegramId] : [];

    // Создаем запись
    const setting = await prisma.setting.create({
      data: {
        key: 'admin_telegram_ids',
        value: JSON.stringify(adminIds)
      }
    });

    console.log('✅ Запись admin_telegram_ids успешно создана:', setting.value);
    console.log('');
    console.log('📝 Чтобы добавить свой Telegram ID:');
    console.log('1. Напишите боту @userinfobot в Telegram');
    console.log('2. Скопируйте ваш ID');
    console.log('3. Обновите запись в базе данных:');
    console.log('   UPDATE settings SET value = \'["YOUR_TELEGRAM_ID"]\' WHERE key = \'admin_telegram_ids\';');

  } catch (error) {
    console.error('❌ Ошибка при настройке admin_telegram_ids:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdminIds();
