import {Query, Resolver } from '@nestjs/graphql';
import {CardsService} from "./cards.service";
import {Card} from "./card.entity";

@Resolver(of => Card)
export class CardsResolver {
  constructor(private cardsService: CardsService) {}

  @Query(returns => [Card])
  cards(): Promise<Card[]> {
    return this.cardsService.findAll();
  }
}
