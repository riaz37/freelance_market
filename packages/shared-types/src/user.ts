import { Prisma } from '@repo/database';
import { UserRole } from './enums';

// Re-export the enum from centralized location
export { UserRole };

// Define interfaces
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profilePicture?: string | null;
  bio?: string | null;
  skills: string[];
  hourlyRate?: number | null;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profilePicture?: string;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
}

export interface UpdateUserInput {
  id: string;
  email?: string | Prisma.StringFieldUpdateOperationsInput;
  firstName?: string | Prisma.StringFieldUpdateOperationsInput;
  lastName?: string | Prisma.StringFieldUpdateOperationsInput;
  role?: UserRole | Prisma.EnumUserRoleFieldUpdateOperationsInput;
  profilePicture?: string | Prisma.StringFieldUpdateOperationsInput | null;
  bio?: string | Prisma.StringFieldUpdateOperationsInput | null;
  skills?: string[] | Prisma.UserUpdateskillsInput;
  hourlyRate?: number | Prisma.FloatFieldUpdateOperationsInput | null;
  isVerified?: boolean | Prisma.BoolFieldUpdateOperationsInput;
}
