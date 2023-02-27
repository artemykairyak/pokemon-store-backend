import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CardsService } from './cards.service';
import { Card } from './card.entity';
import { CreateCardInput } from './dto/create-card.input';
import { Author } from '../authors/entities/author.entity';

@Resolver((of) => Card)
export class CardsResolver {
  constructor(private cardsService: CardsService) {}

  @Query((returns) => [Card])
  getAllCards(): Promise<Card[]> {
    return this.cardsService.findAll();
  }

  @Query((returns) => Card)
  getCard(@Args('id', { type: () => Int }) id: number): Promise<Card> {
    return this.cardsService.findOne(id);
  }

  @ResolveField((returns) => Author)
  author(@Parent() card: Card) {
    return this.cardsService.getAuthor(card.authorId);
  }

  @Mutation((returns) => Card)
  createCard(
    @Args('createCardInput') createCardInput: CreateCardInput,
  ): Promise<Card> {
    return this.cardsService.create(createCardInput);
  }
}
