import { Field, InputType, ID, Float } from '@nestjs/graphql';
import {
  UpdateProjectInput as IUpdateProjectInput,
  ProjectStatus,
} from '@repo/shared-types';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  Min,
} from 'class-validator';

@InputType()
export class UpdateProjectInput implements IUpdateProjectInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @Field(() => ProjectStatus, { nullable: true })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  tags?: string[];
}
