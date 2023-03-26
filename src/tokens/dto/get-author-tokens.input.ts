import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class GetAuthorTokensInput {
  @Field()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  owned?: boolean;
}
