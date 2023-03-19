import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TokenTypesService } from './token-types.service';
import { TokenType } from './entities/token-type.entity';
import { CreateTokenTypeInput } from './dto/create-token-type.input';

@Resolver(() => TokenType)
export class TokenTypesResolver {
  constructor(private readonly tokenTypesService: TokenTypesService) {}

  @Mutation(() => TokenType)
  createTokenType(
    @Args('createTokenTypeInput') createTokenTypeInput: CreateTokenTypeInput,
  ) {
    return this.tokenTypesService.create(createTokenTypeInput);
  }

  @Query(() => [TokenType])
  getAllTokenTypes() {
    return this.tokenTypesService.findAll();
  }

  @Query(() => TokenType)
  getTokenTypeById(@Args('id', { type: () => Int }) id: number) {
    return this.tokenTypesService.findOne(id);
  }

  @Mutation(() => Boolean)
  removeTokenType(@Args('id', { type: () => Int }) id: number) {
    return this.tokenTypesService.remove(id);
  }
}
