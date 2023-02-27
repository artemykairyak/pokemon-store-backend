import { Injectable } from '@nestjs/common';
import { Card } from './card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCardInput } from './dto/create-card.input';
import { AuthorsService } from '../authors/authors.service';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardsRepository: Repository<Card>,
    private authorsService: AuthorsService,
  ) {}

  create(createCardInput: CreateCardInput) {
    const newCard = this.cardsRepository.create(createCardInput);

    return this.cardsRepository.save(newCard);
  }

  findAll() {
    return this.cardsRepository.find();
  }

  findOne(id: number) {
    return this.cardsRepository.findOne({ where: { id } });
  }

  getAuthor(authorId: number) {
    return this.authorsService.findOne(authorId);
  }
}
