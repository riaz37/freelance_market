import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Project } from '../../projects/models/project.model';

@ObjectType()
export class PaginatedProjects {
  @Field(() => [Project])
  projects: Project[];

  @Field(() => Int)
  total: number;

  @Field()
  hasMore: boolean;
}
