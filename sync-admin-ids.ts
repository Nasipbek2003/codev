import { prisma } from './src/lib/prisma';

async function syncAdminIds() {
  try {
    console.log('🔄 Синхронизация admin_telegram_ids...');
    
    // Получаем текущее значение
    const setting = await prisma.setting.findUnique({
      where: { key: 'admin_telegram_ids' }
    });
    
    if (!setting) {
      console.log('❌ Запись admin_telegram_ids не найдена');
      return;
    }
    
    console.log('Текущее значение в БД:', setting.value);
    
    const adminIds = JSON.parse(setting.value);
    console.log('Список администраторов:', adminIds);
    console.log(`Всего администраторов: ${adminIds.length}`);
    
    if (adminIds.length === 0) {
      console.log('⚠️ Нет администраторов в базе данных!');
      console.log('Используйте команду /add_admin в Telegram боте для добавления администратора');
    } else {
      console.log('✅ Администраторы настроены правильно');
      console.log('Теперь заявки будут приходить этим пользователям:');
      adminIds.forEach((id: string, index: number) => {
        console.log(`  ${index + 1}. Telegram ID: ${id}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncAdminIds();
