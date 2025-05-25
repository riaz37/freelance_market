import { PrismaClient } from '@prisma/client';

// Singleton to prevent multiple instances in development
let prismaClient: PrismaClient | undefined;

export function getPrismaClient(): PrismaClient {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}