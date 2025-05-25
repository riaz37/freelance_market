import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
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
    private emailService: EmailService,
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

    // Generate verification code
    const verificationCode = this.generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationCode,
        verificationCodeExpires,
        ...rest,
      },
    });

    // Send verification email
    await this.emailService.sendVerificationEmail(email, rest.firstName, verificationCode);

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

  async verifyEmail(email: string, verificationCode: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    if (!user.verificationCode || user.verificationCode !== verificationCode) {
      throw new BadRequestException('Invalid verification code');
    }

    if (!user.verificationCodeExpires || user.verificationCodeExpires < new Date()) {
      throw new BadRequestException('Verification code has expired');
    }

    // Update user as verified
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationCode: null,
        verificationCodeExpires: null,
      },
    });

    // Send welcome email
    await this.emailService.sendWelcomeEmail(user.email, user.firstName);

    return {
      message: 'Email verified successfully',
      user: updatedUser,
    };
  }

  async resendVerificationCode(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate new verification code
    const verificationCode = this.generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update user with new code
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode,
        verificationCodeExpires,
      },
    });

    // Send verification email
    await this.emailService.sendVerificationEmail(email, user.firstName, verificationCode);

    return {
      message: 'Verification code sent successfully',
    };
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  }
}
