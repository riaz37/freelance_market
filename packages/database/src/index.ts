// Export everything from Prisma Client
export * from '@prisma/client';
export { PrismaClient, Prisma } from '@prisma/client';

// Re-export specific enums for easier access
export { UserRole, ProjectStatus, OrderStatus, NotificationType } from '@prisma/client';

// You can also add helper functions here
export * from './helpers';