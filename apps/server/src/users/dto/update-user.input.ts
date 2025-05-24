import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';
import { IsNotEmpty } from 'class-validator';
import { UpdateUserInput as IUpdateUserInput } from '@repo/shared-types';

@InputType()
export class UpdateUserInput
  extends PartialType(CreateUserInput)
  implements IUpdateUserInput
{
  @Field(() => ID)
  @IsNotEmpty()
  id: string;
}
