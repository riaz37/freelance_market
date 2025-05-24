import { Field, InputType } from '@nestjs/graphql';
import { CreateOrderInput as ICreateOrderInput } from '@repo/shared-types';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType()
export class CreateOrderInput implements ICreateOrderInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  requirements?: string;
}
