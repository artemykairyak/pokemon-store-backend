import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAuthorInput {
  @Field()
  name: string;

  @Field((type) => String, { nullable: true })
  picture?: string;
}
