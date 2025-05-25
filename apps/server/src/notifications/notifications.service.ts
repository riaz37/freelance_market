import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@repo/shared-types';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class NotificationsService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private kafkaService: KafkaService,
    @Inject('PUB_SUB') private pubSub: any,
  ) {}

  async onModuleInit() {
    await this.kafkaService.subscribeToTopic(
      'order-events',
      async (eventData) => {
        await this.handleOrderEvent(eventData);
      },
    );
  }

  async handleOrderEvent(eventData: { type: string; payload: any }) {
    const { type, payload } = eventData;

    switch (type) {
      case 'ORDER_PLACED':
        await this.createNotification(
          NotificationType.ORDER_PLACED,
          payload.freelancerId,
          payload.clientId,
          `New order placed for project: ${payload.projectTitle}`,
        );
        break;
      case 'ORDER_ACCEPTED':
        await this.createNotification(
          NotificationType.ORDER_ACCEPTED,
          payload.clientId,
          payload.freelancerId,
          `Your order for project: ${payload.projectTitle} has been accepted`,
        );
        break;
      case 'ORDER_COMPLETED':
        await this.createNotification(
          NotificationType.ORDER_COMPLETED,
          payload.clientId,
          payload.freelancerId,
          `Your order for project: ${payload.projectTitle} has been completed`,
        );
        break;
      case 'ORDER_CANCELLED':
        await this.createNotification(
          NotificationType.ORDER_CANCELLED,
          payload.receiverId,
          payload.senderId,
          `Order for project: ${payload.projectTitle} has been cancelled`,
        );
        break;
    }
  }

  async createNotification(
    type: NotificationType,
    receiverId: string,
    senderId: string,
    content: string,
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        type,
        content,
        receiverId,
        senderId,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    // Publish real-time activity update
    await this.pubSub.publish('userActivity', {
      userActivity: `${type}: ${content}`,
    });

    return notification;
  }

  async sendOrderEvent(type: string, payload: any) {
    await this.kafkaService.sendMessage('order-events', { type, payload });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { receiverId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
