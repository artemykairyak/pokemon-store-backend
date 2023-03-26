import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateTokenInput {
  @Field()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  picture: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  price: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  type: string;
}
