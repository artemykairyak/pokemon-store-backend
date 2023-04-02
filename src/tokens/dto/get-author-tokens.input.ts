import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class GetAuthorTokensInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  owned?: boolean;
}
