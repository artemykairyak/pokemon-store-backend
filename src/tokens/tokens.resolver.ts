import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Token } from './token.entity';
import { TokensService } from './tokens.service';
import { CreateTokenInput } from './dto/create-token.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BuyTokenInput } from './dto/buy-token.input';
import { GetAuthorTokensInput } from './dto/get-author-tokens.input';
import { UpdateTokenInput } from './dto/update-token.input';
import { PaginatedData, PaginateParams } from '../common.dto';

@Resolver(() => Token)
export class TokensResolver {
  constructor(private tokensService: TokensService) {}

  @Query(() => PaginatedData)
  async getAllTokens(
    @Args('params') { page, limit }: PaginateParams,
  ): Promise<PaginatedData> {
    const { tokens, total } = await this.tokensService.findAll(page, limit);
    return { data: tokens, total };
  }

  @Query(() => [Token])
  getTokensByType(@Args('type') type: string) {
    return this.tokensService.findAllByType(type);
  }

  @Query(() => [Token])
  getUserTokens(
    @Args('getAuthorTokensInput') { userId, owned }: GetAuthorTokensInput,
  ) {
    return this.tokensService.findAllUserTokens(userId, owned);
  }

  @Query(() => Token)
  getToken(@Args('id', { type: () => Int }) id: number) {
    return this.tokensService.findOne(id);
  }

  @Mutation(() => Token)
  @UseGuards(JwtAuthGuard)
  createToken(
    @Args('createTokenInput') createTokenInput: CreateTokenInput,
    @Context() context,
  ) {
    return this.tokensService.create(context.req?.user.id, createTokenInput);
  }

  @Query(() => Token)
  @UseGuards(JwtAuthGuard)
  buyToken(
    @Args('buyTokenInput') buyTokenInput: BuyTokenInput,
    @Context() context,
  ) {
    return this.tokensService.buy(context.req?.user.id, buyTokenInput);
  }

  @Mutation(() => Token)
  @UseGuards(JwtAuthGuard)
  updateToken(
    @Args('updateTokenInput') updateTokenInput: UpdateTokenInput,
    @Context() context,
  ) {
    return this.tokensService.update(context.req?.user.id, updateTokenInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  removeToken(@Args('id', { type: () => Int }) id: number, @Context() context) {
    return this.tokensService.remove(context.req?.user.id, id);
  }
}
