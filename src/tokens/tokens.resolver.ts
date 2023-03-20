import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Token } from './token.entity';
import { TokensService } from './tokens.service';
import { CreateTokenInput } from './dto/create-token.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BuyTokenInput } from './dto/buy-token.input';

@Resolver(() => Token)
export class TokensResolver {
  constructor(private tokensService: TokensService) {}

  @Query(() => [Token])
  getAllTokens() {
    return this.tokensService.findAll();
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

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  removeToken(@Args('id', { type: () => Int }) id: number, @Context() context) {
    return this.tokensService.remove(context.req?.user.id, id);
  }

  @Query(() => Token)
  @UseGuards(JwtAuthGuard)
  buyToken(
    @Args('buyTokenInput') buyTokenInput: BuyTokenInput,
    @Context() context,
  ) {
    return this.tokensService.buy(context.req?.user.id, buyTokenInput);
  }
}
