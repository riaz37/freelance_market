// Export everything from the generated Prisma Client
export * from './generated/prisma';
export { PrismaClient, Prisma } from './generated/prisma';

// Re-export specific enums for easier access
export { UserRole, ProjectStatus, OrderStatus, NotificationType } from './generated/prisma';

// You can also add helper functions here
export * from './helpers';
