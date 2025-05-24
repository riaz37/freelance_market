export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  FREELANCER = 'FREELANCER'
}

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

export interface UpdateUserInput extends Partial<Omit<CreateUserInput, 'password'>> {
  id: string;
}