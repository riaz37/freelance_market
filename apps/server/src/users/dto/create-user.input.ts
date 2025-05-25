import { Field, InputType } from '@nestjs/graphql';
import { CreateUserInput as ICreateUserInput, UserRole } from '@repo/shared-types';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateUserInput implements ICreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  bio?: string;

  @Field(() => [String], { defaultValue: [] })
  @IsOptional()
  skills?: string[];

  @Field({ nullable: true })
  @IsOptional()
  hourlyRate?: number;
}
