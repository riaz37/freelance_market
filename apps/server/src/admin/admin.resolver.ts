import { Resolver, Query, Args, Int, Mutation, Subscription } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { DashboardStats } from './models/dashboard-stats.model';
import { PaginatedUsers } from './models/paginated-users.model';
import { PaginatedProjects } from './models/paginated-projects.model';
import { PaginatedOrders } from './models/paginated-orders.model';
import { UseGuards, Inject } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@repo/shared-types';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PubSub } from 'graphql-subscriptions';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminResolver {
  constructor(
    private readonly adminService: AdminService,
    @Inject('PUB_SUB') private pubSub: any,
  ) {}

  @Query(() => DashboardStats)
  async adminDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Query(() => PaginatedUsers)
  async adminUsers(
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ) {
    return this.adminService.getAllUsers(skip, take);
  }

  @Query(() => PaginatedProjects)
  async adminActiveProjects(
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ) {
    return this.adminService.getActiveProjects(skip, take);
  }

  @Query(() => PaginatedOrders)
  async adminRecentOrders(
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ) {
    return this.adminService.getRecentOrders(skip, take);
  }

  @Mutation(() => Boolean)
  async updateSystemStats() {
    await this.adminService.updateSystemStats();
    const stats = await this.adminService.getDashboardStats();
    await this.pubSub.publish('dashboardStatsUpdated', { dashboardStatsUpdated: stats });
    return true;
  }

  // Real-time subscriptions
  @Subscription(() => DashboardStats)
  dashboardStatsUpdated() {
    return this.pubSub.asyncIterator('dashboardStatsUpdated');
  }

  @Subscription(() => String)
  userActivity() {
    return this.pubSub.asyncIterator('userActivity');
  }

  @Subscription(() => String)
  projectUpdates() {
    return this.pubSub.asyncIterator('projectUpdates');
  }

  @Subscription(() => String)
  orderUpdates() {
    return this.pubSub.asyncIterator('orderUpdates');
  }
}
