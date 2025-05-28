import { Field, ID, ObjectType } from '@nestjs/graphql';
import { NotificationType } from '@repo/shared-types';
import { User } from '../../users/models/user.model';

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string;

  @Field(() => NotificationType)
  type: NotificationType;

  @Field()
  content: string;

  @Field()
  isRead: boolean;

  @Field({ nullable: true })
  senderId?: string;

  @Field(() => User, { nullable: true })
  sender?: User;

  @Field()
  receiverId: string;

  @Field(() => User)
  receiver: User;

  @Field()
  createdAt: Date;
}
