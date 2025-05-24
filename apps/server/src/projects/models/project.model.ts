import { Field, ID, ObjectType, Float } from '@nestjs/graphql';
import { Project as IProject, ProjectStatus } from '@repo/shared-types';
import { User } from '../../users/models/user.model';

@ObjectType()
export class Project implements IProject {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  freelancerId: string;

  @Field(() => User)
  freelancer: User;

  @Field(() => ProjectStatus)
  status: ProjectStatus;

  @Field(() => Float)
  price: number;

  @Field(() => [String])
  tags: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}