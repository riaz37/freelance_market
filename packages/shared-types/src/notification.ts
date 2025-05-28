import { NotificationType } from './enums';

// Re-export the enum from centralized location
export { NotificationType };

export interface Notification {
  id: string;
  type: NotificationType;
  content: string;
  isRead: boolean;
  senderId?: string;
  receiverId: string;
  createdAt: Date;
}