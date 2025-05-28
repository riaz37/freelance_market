import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Order } from '../../orders/models/order.model';

@ObjectType()
export class PaginatedOrders {
  @Field(() => [Order])
  orders: Order[];

  @Field(() => Int)
  total: number;

  @Field()
  hasMore: boolean;
}
