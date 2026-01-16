import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Обновляем проекты в базе данных...');

  // Получаем все существующие проекты
  const existingProjects = await prisma.project.findMany({
    orderBy: { id: 'asc' }
  });

  console.log(`Найдено ${existingProjects.length} проектов`);

  // Обновляем проекты с правильными данными
  const projectsData = [
    {
      title: 'Apakai',
      description: 'Магазин уходовой косметики и мыломоющих средств с быстрой доставкой и качественными товарами',
      imageUrl: '/apakai.png',
      projectUrl: 'https://apakai.vercel.app/',
    },
    {
      title: 'Cosmonaft',
      description: 'Космическая тематика и инновационные решения',
      imageUrl: '/cosmonaft.png',
      projectUrl: 'https://cosmonaft.com',
    },
    {
      title: 'Gold Elegance',
      description: 'Компания по декорированию мероприятий. Создаем незабываемую атмосферу с премиальными материалами',
      imageUrl: '/gold_elegance.png',
      projectUrl: 'https://price-list-goldelegance.vercel.app/',
    },
    {
      title: 'Kelkel Store',
      description: 'Магазин современной бытовой техники с широким ассортиментом и доставкой по Кыргызстану',
      imageUrl: '/kelkel_store.png',
      projectUrl: 'https://kelkel.store/',
    },
  ];

  // Обновляем существующие проекты
  for (let i = 0; i < Math.min(existingProjects.length, projectsData.length); i++) {
    const project = await prisma.project.update({
      where: { id: existingProjects[i].id },
      data: projectsData[i],
    });

    console.log(`✅ Обновлен проект #${project.id}: ${project.title}`);
  }

  // Если проектов меньше чем данных, создаем новые
  if (projectsData.length > existingProjects.length) {
    for (let i = existingProjects.length; i < projectsData.length; i++) {
      const project = await prisma.project.create({
        data: projectsData[i],
      });

      console.log(`✅ Создан новый проект #${project.id}: ${project.title}`);
    }
  }

  console.log('🎉 Обновление проектов завершено!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при обновлении проектов:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
