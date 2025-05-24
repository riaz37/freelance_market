import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { LoginInput as ILoginInput } from '@repo/shared-types';

@InputType()
export class LoginInput implements ILoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
