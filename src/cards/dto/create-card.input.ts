import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCardInput {
  @Field()
  name: string;

  @Field()
  picture: string;

  @Field((type) => Float, { nullable: true })
  price: number;

  @Field((type) => Int)
  authorId: number;
}
