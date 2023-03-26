import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { Token } from './tokens/token.entity';
import { DEFAULT_LIMIT, INITIAL_PAGE } from './constants';

@InputType()
export class PaginateParams {
  @Field(() => Int, { nullable: true, defaultValue: INITIAL_PAGE })
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: DEFAULT_LIMIT })
  @IsNumber()
  limit?: number;
}

@ObjectType()
export class PaginatedData {
  @Field(() => [Token])
  data: Token[];

  @Field(() => Int, { nullable: true })
  total: number;
}
