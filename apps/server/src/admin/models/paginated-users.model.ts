import { Field, ObjectType, Int } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';

@ObjectType()
export class PaginatedUsers {
  @Field(() => [User])
  users: User[];

  @Field(() => Int)
  total: number;
}
