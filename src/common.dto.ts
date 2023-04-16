import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { DEFAULT_LIMIT, INITIAL_PAGE } from './constants';
import { Token } from './tokens/token.entity';
import { User } from './users/user.entity';
import { TokenType } from './token-types/entities/token-type.entity';

@InputType()
export class PaginateParams {
  @Field(() => Int, { nullable: true, defaultValue: INITIAL_PAGE })
  @IsOptional()
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: DEFAULT_LIMIT })
  @IsOptional()
  limit?: number;
}

@InputType()
export class TokensFilterParams {
  @Field(() => String, { nullable: true, defaultValue: '' })
  types?: string;

  @Field(() => String, { nullable: true, defaultValue: '' })
  search?: string;
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
export class PaginatedTokenTypesData extends PaginatedData {
  @Field(() => [TokenType])
  data: TokenType[];
}

@ObjectType()
export class PaginatedUsersData extends PaginatedData {
  @Field(() => [User])
  data: User[];
}
