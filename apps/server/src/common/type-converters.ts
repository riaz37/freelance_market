/**
 * Type conversion utilities for mapping between Prisma types and GraphQL types
 */

import {
  UserRole,
  ProjectStatus,
  OrderStatus,
  NotificationType,
  User as SharedUser,
  Project as SharedProject,
  Order as SharedOrder,
} from '@repo/shared-types';
import { User as PrismaUser, Project as PrismaProject, Order as PrismaOrder } from '@repo/database';

/**
 * Convert Prisma User to GraphQL User
 */
export function convertPrismaUserToGraphQL(prismaUser: PrismaUser): SharedUser {
  return {
    ...prismaUser,
    role: prismaUser.role as UserRole,
    skills: prismaUser.skills || [],
  };
}

/**
 * Convert Prisma Project to GraphQL Project
 */
export function convertPrismaProjectToGraphQL(prismaProject: PrismaProject): SharedProject {
  return {
    ...prismaProject,
    status: prismaProject.status as ProjectStatus,
    tags: prismaProject.tags || [],
  };
}

/**
 * Convert Prisma Order to GraphQL Order
 */
export function convertPrismaOrderToGraphQL(prismaOrder: PrismaOrder): SharedOrder {
  return {
    ...prismaOrder,
    status: prismaOrder.status as OrderStatus,
  };
}

/**
 * Convert array of Prisma Users to GraphQL Users
 */
export function convertPrismaUsersToGraphQL(prismaUsers: PrismaUser[]): SharedUser[] {
  return prismaUsers.map(convertPrismaUserToGraphQL);
}

/**
 * Convert array of Prisma Projects to GraphQL Projects
 */
export function convertPrismaProjectsToGraphQL(prismaProjects: PrismaProject[]): SharedProject[] {
  return prismaProjects.map(convertPrismaProjectToGraphQL);
}

/**
 * Convert array of Prisma Orders to GraphQL Orders
 */
export function convertPrismaOrdersToGraphQL(prismaOrders: PrismaOrder[]): SharedOrder[] {
  return prismaOrders.map(convertPrismaOrderToGraphQL);
}

/**
 * Type guards for enum validation
 */
export function isValidUserRole(role: string): role is UserRole {
  return Object.values(UserRole).includes(role as UserRole);
}

export function isValidProjectStatus(status: string): status is ProjectStatus {
  return Object.values(ProjectStatus).includes(status as ProjectStatus);
}

export function isValidOrderStatus(status: string): status is OrderStatus {
  return Object.values(OrderStatus).includes(status as OrderStatus);
}

export function isValidNotificationType(type: string): type is NotificationType {
  return Object.values(NotificationType).includes(type as NotificationType);
}
