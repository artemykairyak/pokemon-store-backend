import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateLinkInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  url: string;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  type: number;
}
