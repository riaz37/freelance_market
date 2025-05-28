import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectStatus, OrderStatus } from '@repo/shared-types';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalProjects,
      activeProjects,
      totalOrders,
      activeOrders,
      completedOrders,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.project.count(),
      this.prisma.project.count({
        where: { status: ProjectStatus.PUBLISHED },
      }),
      this.prisma.order.count(),
      this.prisma.order.count({
        where: {
          status: {
            in: [OrderStatus.ACCEPTED, OrderStatus.IN_PROGRESS],
          },
        },
      }),
      this.prisma.order.count({
        where: { status: OrderStatus.COMPLETED },
      }),
      this.prisma.order.aggregate({
        where: { status: OrderStatus.COMPLETED },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      totalUsers,
      totalProjects,
      activeProjects,
      totalOrders,
      activeOrders,
      completedOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
    };
  }

  async getAllUsers(skip = 0, take = 10) {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users,
      total,
    };
  }

  async getActiveProjects(skip = 0, take = 10) {
    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where: { status: ProjectStatus.PUBLISHED },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          freelancer: true,
        },
      }),
      this.prisma.project.count({
        where: { status: ProjectStatus.PUBLISHED },
      }),
    ]);

    return {
      projects,
      total,
      hasMore: skip + take < total,
    };
  }

  async getRecentOrders(skip = 0, take = 10) {
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          client: true,
          project: {
            include: {
              freelancer: true,
            },
          },
        },
      }),
      this.prisma.order.count(),
    ]);

    return {
      orders,
      total,
      hasMore: skip + take < total,
    };
  }

  async updateSystemStats() {
    const stats = await this.getDashboardStats();

    return this.prisma.systemStats.upsert({
      where: { id: 'system-stats' },
      update: {
        totalUsers: stats.totalUsers,
        totalProjects: stats.totalProjects,
        totalOrders: stats.totalOrders,
        activeOrders: stats.activeOrders,
        completedOrders: stats.completedOrders,
        totalRevenue: stats.totalRevenue,
        lastUpdated: new Date(),
      },
      create: {
        id: 'system-stats',
        totalUsers: stats.totalUsers,
        totalProjects: stats.totalProjects,
        totalOrders: stats.totalOrders,
        activeOrders: stats.activeOrders,
        completedOrders: stats.completedOrders,
        totalRevenue: stats.totalRevenue,
      },
    });
  }
}
