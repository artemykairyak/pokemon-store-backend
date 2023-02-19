import { Injectable } from '@nestjs/common';
import {Card} from "./card.entity";

@Injectable()
export class CardsService {
  async findAll(): Promise<Card[]> {
    const card = new Card();
    card.id = 1;
    card.name = 'Bulbasaur';
    card.picture = 'sds';

    return [card]
  }
}
