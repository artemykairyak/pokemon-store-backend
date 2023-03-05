import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignUpUserInput {
  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  email: string;
}
