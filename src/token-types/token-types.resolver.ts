import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TokenTypesService } from './token-types.service';
import { TokenType } from './entities/token-type.entity';
import { CreateTokenTypeInput } from './dto/create-token-type.input';
import { PaginatedTokenTypesData, PaginateParams } from '../common.dto';

@Resolver(() => TokenType)
export class TokenTypesResolver {
  constructor(private readonly tokenTypesService: TokenTypesService) {}

  @Mutation(() => TokenType)
  createTokenType(
    @Args('createTokenTypeInput') createTokenTypeInput: CreateTokenTypeInput,
  ) {
    return this.tokenTypesService.create(createTokenTypeInput);
  }

  @Query(() => PaginatedTokenTypesData)
  async getTokenTypes(
    @Args('params') { page, limit }: PaginateParams,
  ): Promise<PaginatedTokenTypesData> {
    const { tokenTypes, total } = await this.tokenTypesService.findAll(
      page,
      limit,
    );

    return { data: tokenTypes, total };
  }

  @Query(() => TokenType)
  getTokenTypeById(@Args('id') id: string) {
    return this.tokenTypesService.findOne(id);
  }

  @Mutation(() => Boolean)
  removeTokenType(@Args('id') id: string) {
    return this.tokenTypesService.remove(id);
  }
}
