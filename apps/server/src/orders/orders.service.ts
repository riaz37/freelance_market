import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@repo/shared-types';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        client: true,
        project: {
          include: {
            freelancer: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        client: true,
        project: {
          include: {
            freelancer: true,
          },
        },
      },
    });
  }

  async findByClient(clientId: string) {
    return this.prisma.order.findMany({
      where: { clientId },
      include: {
        client: true,
        project: {
          include: {
            freelancer: true,
          },
        },
      },
    });
  }

  async findByFreelancer(freelancerId: string) {
    return this.prisma.order.findMany({
      where: {
        project: {
          freelancerId,
        },
      },
      include: {
        client: true,
        project: {
          include: {
            freelancer: true,
          },
        },
      },
    });
  }

  async create(clientId: string, createOrderInput: CreateOrderInput) {
    // Get the project to calculate total amount
    const project = await this.prisma.project.findUnique({
      where: { id: createOrderInput.projectId },
      include: {
        freelancer: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const order = await this.prisma.order.create({
      data: {
        ...createOrderInput,
        clientId,
        totalAmount: project.price,
        status: OrderStatus.PENDING,
      },
      include: {
        client: true,
        project: {
          include: {
            freelancer: true,
          },
        },
      },
    });

    // Send notification via Kafka
    await this.notificationsService.sendOrderEvent('ORDER_PLACED', {
      orderId: order.id,
      projectId: project.id,
      projectTitle: project.title,
      clientId: clientId,
      freelancerId: project.freelancerId,
    });

    return order;
  }

  async update(id: string, updateOrderInput: UpdateOrderInput) {
    return this.prisma.order.update({
      where: { id },
      data: {
        status: updateOrderInput.status,
        requirements: updateOrderInput.requirements,
        deliveryDate: updateOrderInput.deliveryDate,
      },
      include: {
        client: true,
        project: {
          include: {
            freelancer: true,
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        client: true,
        project: {
          include: {
            freelancer: true,
          },
        },
      },
    });

    // Send notification via Kafka based on status
    const eventType = this.getEventTypeFromStatus(status);
    if (eventType) {
      await this.notificationsService.sendOrderEvent(eventType, {
        orderId: order.id,
        projectId: order.project.id,
        projectTitle: order.project.title,
        clientId: order.clientId,
        freelancerId: order.project.freelancerId,
        senderId: order.project.freelancerId,
        receiverId: order.clientId,
      });
    }

    return order;
  }

  private getEventTypeFromStatus(status: OrderStatus): string | null {
    switch (status) {
      case OrderStatus.ACCEPTED:
        return 'ORDER_ACCEPTED';
      case OrderStatus.COMPLETED:
        return 'ORDER_COMPLETED';
      case OrderStatus.CANCELLED:
        return 'ORDER_CANCELLED';
      default:
        return null;
    }
  }
}
