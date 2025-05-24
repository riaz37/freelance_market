import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { DashboardStats } from './models/dashboard-stats.model';
import { PaginatedUsers } from './models/paginated-users.model';
import { PaginatedProjects } from './models/paginated-projects.model';
import { PaginatedOrders } from './models/paginated-orders.model';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@repo/shared-types';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

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
    return true;
  }
}
