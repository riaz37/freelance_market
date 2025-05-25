/**
 * Centralized enum definitions for the entire application
 * These enums are used across Prisma, GraphQL, and all application layers
 */

export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  FREELANCER = 'FREELANCER',
}

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED',
  REVISION = 'REVISION',
}

export enum NotificationType {
  ORDER_PLACED = 'ORDER_PLACED',
  ORDER_ACCEPTED = 'ORDER_ACCEPTED',
  ORDER_COMPLETED = 'ORDER_COMPLETED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  REVIEW_RECEIVED = 'REVIEW_RECEIVED',
}

// Type guards for runtime type checking
export const isUserRole = (value: string): value is UserRole => {
  return Object.values(UserRole).includes(value as UserRole);
};

export const isProjectStatus = (value: string): value is ProjectStatus => {
  return Object.values(ProjectStatus).includes(value as ProjectStatus);
};

export const isOrderStatus = (value: string): value is OrderStatus => {
  return Object.values(OrderStatus).includes(value as OrderStatus);
};

export const isNotificationType = (value: string): value is NotificationType => {
  return Object.values(NotificationType).includes(value as NotificationType);
};
