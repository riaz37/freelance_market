import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { VerifyEmailInput } from './dto/verify-email.input';
import { ResendVerificationInput } from './dto/resend-verification.input';
import { AuthResponse } from './models/auth.model';
import { VerificationResponse, ResendVerificationResponse } from './models/verification-response.model';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => AuthResponse)
  async register(@Args('registerInput') registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Mutation(() => VerificationResponse)
  async verifyEmail(@Args('verifyEmailInput') verifyEmailInput: VerifyEmailInput) {
    return this.authService.verifyEmail(verifyEmailInput.email, verifyEmailInput.verificationCode);
  }

  @Mutation(() => ResendVerificationResponse)
  async resendVerificationCode(@Args('resendVerificationInput') resendVerificationInput: ResendVerificationInput) {
    return this.authService.resendVerificationCode(resendVerificationInput.email);
  }
}
