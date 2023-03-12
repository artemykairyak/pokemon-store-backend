import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Token } from './token.entity';
import { TokensService } from './tokens.service';
import { CreateTokenInput } from './dto/create-token.input';

@Resolver((of) => Token)
export class TokensResolver {
  constructor(private tokensService: TokensService) {}

  @Query(() => [Token])
  getAllTokens(): Promise<Token[]> {
    return this.tokensService.findAll();
  }

  @Query(() => Token)
  getToken(@Args('id', { type: () => Int }) id: number): Promise<Token> {
    return this.tokensService.findOne(id);
  }

  // @ResolveField(() => User)
  // author(@Parent() Token: Token) {
  //   return this.tokensService.getAuthor(Token.authorId);
  // }

  @Mutation(() => Token)
  createToken(
    @Args('createTokenInput') createTokenInput: CreateTokenInput,
  ): Promise<Token> {
    return this.tokensService.create(createTokenInput);
  }
}
