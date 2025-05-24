import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderInput, UpdateOrderInput, OrderStatus } from '@repo/shared-types';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

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
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.order.create({
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
  }

  async update(id: string, updateOrderInput: UpdateOrderInput) {
    return this.prisma.order.update({
      where: { id },
      data: updateOrderInput,
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
    return this.prisma.order.update({
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
  }
}