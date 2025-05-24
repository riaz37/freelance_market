import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { UserRole } from '@repo/shared-types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }

  async login(loginInput: LoginInput) {
    const { email, password } = loginInput;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as UserRole,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerInput: RegisterInput) {
    const { email, password, ...rest } = registerInput;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        ...rest,
      },
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as UserRole,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
