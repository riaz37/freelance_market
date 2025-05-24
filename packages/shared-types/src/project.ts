export enum ProjectStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

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

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  id: string;
  status?: ProjectStatus;
}
