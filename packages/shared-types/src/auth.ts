import { User } from './user';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isVerified'> {
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}