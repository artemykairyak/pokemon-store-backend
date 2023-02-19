import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsResolver } from './cards.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { AuthorsModule } from '../authors/authors.module';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), AuthorsModule],
  providers: [CardsService, CardsResolver],
})
export class CardsModule {}
