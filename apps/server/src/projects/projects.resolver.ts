import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { Project } from './models/project.model';
import { CreateProjectInput, UpdateProjectInput } from './dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@repo/shared-types';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => [Project])
  async projects() {
    return this.projectsService.findAll();
  }

  @Query(() => Project)
  async project(@Args('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.FREELANCER)
  @Query(() => [Project])
  async myProjects(@Context() context) {
    const { user } = context.req;
    return this.projectsService.findByFreelancer(user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.FREELANCER)
  @Mutation(() => Project)
  async createProject(
    @Args('createProjectInput') createProjectInput: CreateProjectInput,
    @Context() context,
  ) {
    const { user } = context.req;
    return this.projectsService.create(user.sub, createProjectInput);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.FREELANCER)
  @Mutation(() => Project)
  async updateProject(
    @Args('updateProjectInput') updateProjectInput: UpdateProjectInput,
  ) {
    return this.projectsService.update(updateProjectInput.id, updateProjectInput);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.FREELANCER)
  @Mutation(() => Project)
  async publishProject(@Args('id') id: string) {
    return this.projectsService.publish(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.FREELANCER)
  @Mutation(() => Project)
  async deleteProject(@Args('id') id: string) {
    return this.projectsService.remove(id);
  }
}