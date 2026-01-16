import { prisma } from './prisma';

/**
 * Получить админские Telegram ID из базы данных
 * @returns Promise<string[]> - массив Telegram ID администраторов
 */
export async function getAdminTelegramIds(): Promise<string[]> {
  try {
    console.log('Подключение к БД для получения admin_telegram_ids...');
    
    const setting = await prisma.setting.findUnique({
      where: { key: 'admin_telegram_ids' }
    });
    
    if (!setting) {
      console.warn('Не найдены admin_telegram_ids в таблице settings');
      return [];
    }
    
    console.log('Получены admin_telegram_ids из БД:', setting.value);
    
    // Парсим JSON массив из поля value
    try {
      const adminIds = JSON.parse(setting.value);
      
      if (!Array.isArray(adminIds)) {
        console.error('admin_telegram_ids должен быть массивом');
        return [];
      }
      
      console.log(`Найдено ${adminIds.length} администраторов:`, adminIds);
      return adminIds;
      
    } catch (parseError) {
      console.error('Ошибка парсинга JSON admin_telegram_ids:', parseError);
      return [];
    }
    
  } catch (error) {
    console.error('Ошибка при получении admin_telegram_ids из БД:', error);
    return [];
  }
}

/**
 * Проверить подключение к базе данных
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT NOW()`;
    console.log('✅ Подключение к БД успешно');
    return true;
  } catch (error) {
    console.error('❌ Ошибка подключения к БД:', error);
    return false;
  }
}

/**
 * Интерфейс проекта
 */
export interface Project {
  id: number;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  projectUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Получить все проекты из базы данных
 * @returns Promise<Project[]> - массив проектов
 */
export async function getProjects(): Promise<Project[]> {
  try {
    console.log('Получение проектов из БД...');
    
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Найдено ${projects.length} проектов в БД`);
    return projects;
    
  } catch (error) {
    console.error('Ошибка при получении проектов из БД:', error);
    throw error;
  }
}

/**
 * Получить проект по ID
 * @param id - ID проекта
 * @returns Promise<Project | null> - проект или null если не найден
 */
export async function getProjectById(id: number): Promise<Project | null> {
  try {
    console.log(`Получение проекта с ID ${id} из БД...`);
    
    const project = await prisma.project.findUnique({
      where: { id }
    });
    
    if (!project) {
      console.log(`Проект с ID ${id} не найден`);
      return null;
    }
    
    return project;
    
  } catch (error) {
    console.error(`Ошибка при получении проекта с ID ${id} из БД:`, error);
    throw error;
  }
}
