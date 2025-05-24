import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';
import { AuthResponse as IAuthResponse } from '@repo/shared-types';

@ObjectType()
export class AuthResponse implements IAuthResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
