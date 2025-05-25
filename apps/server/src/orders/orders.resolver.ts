import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './models/order.model';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole, OrderStatus } from '@repo/shared-types';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => Order)
  async order(@Args('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @Query(() => [Order])
  async myOrders(@Context() context) {
    const { user } = context.req;
    return this.ordersService.findByClient(user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.FREELANCER)
  @Query(() => [Order])
  async receivedOrders(@Context() context) {
    const { user } = context.req;
    return this.ordersService.findByFreelancer(user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @Mutation(() => Order)
  async createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
    @Context() context,
  ) {
    const { user } = context.req;
    return this.ordersService.create(user.sub, createOrderInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Order)
  async updateOrder(
    @Args('updateOrderInput') updateOrderInput: UpdateOrderInput,
  ) {
    return this.ordersService.update(updateOrderInput.id, updateOrderInput);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.FREELANCER)
  @Mutation(() => Order)
  async acceptOrder(@Args('id') id: string) {
    return this.ordersService.updateStatus(id, OrderStatus.ACCEPTED);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.FREELANCER)
  @Mutation(() => Order)
  async startOrder(@Args('id') id: string) {
    return this.ordersService.updateStatus(id, OrderStatus.IN_PROGRESS);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.FREELANCER)
  @Mutation(() => Order)
  async completeOrder(@Args('id') id: string) {
    return this.ordersService.updateStatus(id, OrderStatus.COMPLETED);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Order)
  async cancelOrder(@Args('id') id: string) {
    return this.ordersService.updateStatus(id, OrderStatus.CANCELLED);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @Mutation(() => Order)
  async requestRevision(@Args('id') id: string) {
    return this.ordersService.updateStatus(id, OrderStatus.REVISION);
  }
}
