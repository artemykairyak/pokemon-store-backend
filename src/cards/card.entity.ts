import {Field, Float, Int, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class Card {
  @Field(type => Int)
  id: number;

  @Field()
  picture: string;

  @Field()
  name: string;

  @Field(type => Float, {nullable: true})
  price?: number;
}
