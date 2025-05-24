import { Field, InputType, ID } from '@nestjs/graphql';
import {
  UpdateOrderInput as IUpdateOrderInput,
  OrderStatus,
} from '@repo/shared-types';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
} from 'class-validator';

@InputType()
export class UpdateOrderInput implements IUpdateOrderInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field(() => OrderStatus, { nullable: true })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  requirements?: string;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  deliveryDate?: Date;
}
