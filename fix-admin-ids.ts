import { prisma } from './src/lib/prisma';

async function fixAdminIds() {
  try {
    console.log('🔧 Исправление формата admin_telegram_ids...');
    
    // Получаем текущее значение
    const setting = await prisma.setting.findUnique({
      where: { key: 'admin_telegram_ids' }
    });
    
    if (!setting) {
      console.log('❌ Запись admin_telegram_ids не найдена в БД');
      console.log('Создаем новую запись...');
      
      // Создаем новую запись с пустым массивом
      await prisma.setting.create({
        data: {
          key: 'admin_telegram_ids',
          value: '[]'
        }
      });
      
      console.log('✅ Создана запись с пустым массивом');
      return;
    }
    
    console.log('Текущее значение:', setting.value);
    
    // Проверяем формат
    try {
      const parsed = JSON.parse(setting.value);
      
      if (Array.isArray(parsed)) {
        console.log('✅ Формат уже правильный (массив):', parsed);
        return;
      }
    } catch (e) {
      // Не JSON, нужно исправить
    }
    
    // Исправляем формат - оборачиваем в массив
    const currentValue = setting.value.trim();
    let newValue: string;
    
    if (currentValue === '') {
      newValue = '[]';
    } else {
      // Если это одно число или строка, оборачиваем в массив
      newValue = `["${currentValue}"]`;
    }
    
    console.log('Новое значение:', newValue);
    
    // Обновляем в БД
    await prisma.setting.update({
      where: { key: 'admin_telegram_ids' },
      data: { value: newValue }
    });
    
    console.log('✅ Формат исправлен!');
    console.log('Проверка:', JSON.parse(newValue));
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminIds();
