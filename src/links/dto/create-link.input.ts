import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateLinkInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
