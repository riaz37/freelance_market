import { Field, ID, ObjectType, Float } from '@nestjs/graphql';
import { Order as IOrder, OrderStatus } from '@repo/shared-types';
import { User } from '../../users/models/user.model';
import { Project } from '../../projects/models/project.model';

@ObjectType()
export class Order implements IOrder {
  @Field(() => ID)
  id: string;

  @Field()
  projectId: string;

  @Field(() => Project)
  project: Project;

  @Field()
  clientId: string;

  @Field(() => User)
  client: User;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => Float)
  totalAmount: number;

  @Field({ nullable: true })
  requirements?: string;

  @Field({ nullable: true })
  deliveryDate?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
