import { JwtPayload as IJwtPayload } from '@repo/shared-types';
import { UserRole } from '@repo/shared-types';

export interface JwtPayload extends IJwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
