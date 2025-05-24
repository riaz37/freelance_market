export enum NotificationType {
  ORDER_PLACED = 'ORDER_PLACED',
  ORDER_ACCEPTED = 'ORDER_ACCEPTED',
  ORDER_COMPLETED = 'ORDER_COMPLETED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  REVIEW_RECEIVED = 'REVIEW_RECEIVED'
}

export interface Notification {
  id: string;
  type: NotificationType;
  content: string;
  isRead: boolean;
  senderId: string;
  receiverId: string;
  createdAt: Date;
}