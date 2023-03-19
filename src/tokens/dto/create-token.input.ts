import { Field, Float, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateTokenInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  picture: string;

  @Field()
  @IsString()
  description: string;

  @Field(() => Float)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  type: string;
}
