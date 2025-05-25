// Export everything from the generated Prisma Client
export * from '../node_modules/.prisma/client';
export { PrismaClient, Prisma } from '../node_modules/.prisma/client';

// Re-export specific enums for easier access
export { UserRole, ProjectStatus, OrderStatus, NotificationType } from '../node_modules/.prisma/client';

// You can also add helper functions here
export * from './helpers';