import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...');

  // Создаем настройку для admin_telegram_ids если её нет
  const adminSetting = await prisma.setting.upsert({
    where: { key: 'admin_telegram_ids' },
    update: {},
    create: {
      key: 'admin_telegram_ids',
      value: JSON.stringify([]), // Пустой массив по умолчанию
    },
  });

  console.log('✅ Создана настройка admin_telegram_ids:', adminSetting);

  // Создаем настройку для menu_photo если её нет
  const menuPhotoSetting = await prisma.setting.upsert({
    where: { key: 'menu_photo' },
    update: {},
    create: {
      key: 'menu_photo',
      value: '',
    },
  });

  console.log('✅ Создана настройка menu_photo:', menuPhotoSetting);

  // Проверяем существующие проекты
  const existingProjects = await prisma.project.count();
  
  if (existingProjects === 0) {
    console.log('📦 Создаем примеры проектов...');
    
    const projects = await prisma.project.createMany({
      data: [
        {
          title: 'Apakai',
          description: 'Интернет-магазин одежды с современным дизайном',
          imageUrl: '/apakai.png',
          projectUrl: 'https://apakai.com',
        },
        {
          title: 'Cosmonaft',
          description: 'Космическая тематика и инновационные решения',
          imageUrl: '/cosmonaft.png',
          projectUrl: 'https://cosmonaft.com',
        },
        {
          title: 'Gold Elegance',
          description: 'Премиум ювелирный магазин',
          imageUrl: '/gold_elegance.png',
          projectUrl: 'https://gold-elegance.com',
        },
        {
          title: 'Kelkel Store',
          description: 'Универсальный онлайн магазин',
          imageUrl: '/kelkel_store.png',
          projectUrl: 'https://kelkel.store',
        },
      ],
    });

    console.log(`✅ Создано ${projects.count} проектов`);
  } else {
    console.log(`ℹ️ В базе уже есть ${existingProjects} проектов, пропускаем создание примеров`);
  }

  console.log('🎉 Заполнение базы данных завершено!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
