import { PrismaClient } from '@prisma/client';

// Глобальная переменная для хранения экземпляра Prisma в development режиме
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Создаем единственный экземпляр Prisma Client
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// В development режиме сохраняем экземпляр глобально для hot reload
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
