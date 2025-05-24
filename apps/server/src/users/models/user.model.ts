import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User as IUser, UserRole } from '@repo/shared-types';

@ObjectType()
export class User implements Omit<IUser, 'password'> {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field({ nullable: true })
  profilePicture?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field(() => [String])
  skills: string[];

  @Field({ nullable: true })
  hourlyRate?: number;

  @Field()
  isVerified: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
