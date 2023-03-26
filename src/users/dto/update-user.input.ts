import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  picture?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cover?: string;
}
