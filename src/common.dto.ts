import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { DEFAULT_LIMIT, INITIAL_PAGE } from './constants';
import { Token } from './tokens/token.entity';
import { User } from './users/user.entity';

@InputType()
export class PaginateParams {
  @Field(() => Int, { nullable: true, defaultValue: INITIAL_PAGE })
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: DEFAULT_LIMIT })
  @IsNumber()
  limit?: number;
}

@ObjectType({ isAbstract: true })
abstract class PaginatedData {
  @Field(() => Int)
  total: number;
}

@ObjectType()
export class PaginatedTokensData extends PaginatedData {
  @Field(() => [Token])
  data: Token[];
}

@ObjectType()
export class PaginatedUsersData extends PaginatedData {
  @Field(() => [User])
  data: User[];
}
