import { Injectable } from '@nestjs/common';
import { Token } from './token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTokenInput } from './dto/create-token.input';
import { UsersService } from '../users/users.service';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private tokensRepository: Repository<Token>,
    private usersService: UsersService,
  ) {}

  create(createTokenInput: CreateTokenInput) {
    const newCard = this.tokensRepository.create(createTokenInput);

    return this.tokensRepository.save(newCard);
  }

  findAll() {
    return this.tokensRepository.find();
  }

  findOne(id: number) {
    return this.tokensRepository.findOne({ where: { id } });
  }

  // getAuthor(authorId: number) {
  //   return this.usersService.findOne(authorId);
  // }
}
