/**
 * GraphQL Enum Registrations
 * This file registers all enums with GraphQL schema builder
 * Import this file early in the application lifecycle to ensure enums are registered
 */

import { registerEnumType } from '@nestjs/graphql';
import {
  UserRole,
  ProjectStatus,
  OrderStatus,
  NotificationType,
} from '@repo/shared-types';

// Register UserRole enum
registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role in the system',
  valuesMap: {
    ADMIN: {
      description: 'Administrator with full system access',
    },
    CLIENT: {
      description: 'Client who can post projects and hire freelancers',
    },
    FREELANCER: {
      description: 'Freelancer who can work on projects',
    },
  },
});

// Register ProjectStatus enum
registerEnumType(ProjectStatus, {
  name: 'ProjectStatus',
  description: 'Status of a project',
  valuesMap: {
    DRAFT: {
      description: 'Project is in draft state',
    },
    PUBLISHED: {
      description: 'Project is published and available for bidding',
    },
    COMPLETED: {
      description: 'Project has been completed',
    },
    CANCELLED: {
      description: 'Project has been cancelled',
    },
  },
});

// Register OrderStatus enum
registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'Status of an order',
  valuesMap: {
    PENDING: {
      description: 'Order is pending acceptance',
    },
    ACCEPTED: {
      description: 'Order has been accepted by freelancer',
    },
    IN_PROGRESS: {
      description: 'Order is currently being worked on',
    },
    COMPLETED: {
      description: 'Order has been completed',
    },
    CANCELLED: {
      description: 'Order has been cancelled',
    },
    DISPUTED: {
      description: 'Order is in dispute',
    },
    REVISION: {
      description: 'Order requires revision',
    },
  },
});

// Register NotificationType enum
registerEnumType(NotificationType, {
  name: 'NotificationType',
  description: 'Type of notification',
  valuesMap: {
    ORDER_PLACED: {
      description: 'Notification for when an order is placed',
    },
    ORDER_ACCEPTED: {
      description: 'Notification for when an order is accepted',
    },
    ORDER_COMPLETED: {
      description: 'Notification for when an order is completed',
    },
    ORDER_CANCELLED: {
      description: 'Notification for when an order is cancelled',
    },
    PAYMENT_RECEIVED: {
      description: 'Notification for when payment is received',
    },
    MESSAGE_RECEIVED: {
      description: 'Notification for when a message is received',
    },
    REVIEW_RECEIVED: {
      description: 'Notification for when a review is received',
    },
  },
});

// Export the enums for use in other files
export { UserRole, ProjectStatus, OrderStatus, NotificationType };
