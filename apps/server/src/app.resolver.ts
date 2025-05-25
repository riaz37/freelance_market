import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  healthCheck(): string {
    return 'API is running';
  }
}
