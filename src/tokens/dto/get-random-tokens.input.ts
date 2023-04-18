import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class GetRandomTokensInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  count: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  username?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  excludedId?: number;
}
