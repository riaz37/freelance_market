import { Field, ObjectType, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class DashboardStats {
  @Field(() => Int)
  totalUsers: number;

  @Field(() => Int)
  totalProjects: number;

  @Field(() => Int)
  activeProjects: number;

  @Field(() => Int)
  totalOrders: number;

  @Field(() => Int)
  activeOrders: number;

  @Field(() => Int)
  completedOrders: number;

  @Field(() => Float)
  totalRevenue: number;
}
