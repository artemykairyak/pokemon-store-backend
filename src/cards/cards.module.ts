import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsResolver } from './cards.resolver';

@Module({
  providers: [CardsService, CardsResolver]
})
export class CardsModule {}
