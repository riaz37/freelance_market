import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';

@ObjectType()
export class VerificationResponse {
  @Field()
  message: string;

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class ResendVerificationResponse {
  @Field()
  message: string;
}
