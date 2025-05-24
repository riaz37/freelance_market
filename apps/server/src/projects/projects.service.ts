import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectInput, UpdateProjectInput, ProjectStatus } from '@repo/shared-types';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
      include: {
        freelancer: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        freelancer: true,
      },
    });
  }

  async findByFreelancer(freelancerId: string) {
    return this.prisma.project.findMany({
      where: { freelancerId },
      include: {
        freelancer: true,
      },
    });
  }

  async create(freelancerId: string, createProjectInput: CreateProjectInput) {
    return this.prisma.project.create({
      data: {
        ...createProjectInput,
        freelancerId,
        status: ProjectStatus.DRAFT,
      },
      include: {
        freelancer: true,
      },
    });
  }

  async update(id: string, updateProjectInput: UpdateProjectInput) {
    return this.prisma.project.update({
      where: { id },
      data: updateProjectInput,
      include: {
        freelancer: true,
      },
    });
  }

  async publish(id: string) {
    return this.prisma.project.update({
      where: { id },
      data: { status: ProjectStatus.PUBLISHED },
      include: {
        freelancer: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}