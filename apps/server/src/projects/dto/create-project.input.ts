import { Field, InputType, Float } from '@nestjs/graphql';
import { CreateProjectInput as ICreateProjectInput } from '@repo/shared-types';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, Min } from 'class-validator';

@InputType()
export class CreateProjectInput implements ICreateProjectInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;

  @Field(() => [String], { defaultValue: [] })
  @IsArray()
  @IsOptional()
  tags?: string[];
}