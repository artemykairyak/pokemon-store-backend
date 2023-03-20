import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateStatsInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  updateField: 'usersCount' | 'tokensCount';
}
