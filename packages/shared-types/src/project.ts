import { Prisma } from '@repo/database';
import { ProjectStatus } from './enums';

// Re-export the enum from centralized location
export { ProjectStatus };

export interface Project {
  id: string;
  title: string;
  description: string;
  freelancerId: string;
  status: ProjectStatus;
  price: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectInput {
  title: string;
  description: string;
  price: number;
  tags?: string[];
}

export interface UpdateProjectInput {
  id: string;
  title?: string | Prisma.StringFieldUpdateOperationsInput;
  description?: string | Prisma.StringFieldUpdateOperationsInput;
  price?: number | Prisma.FloatFieldUpdateOperationsInput;
  status?: ProjectStatus | Prisma.EnumProjectStatusFieldUpdateOperationsInput;
  tags?: string[] | Prisma.ProjectUpdatetagsInput;
}
