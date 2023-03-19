import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Token } from './token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTokenInput } from './dto/create-token.input';
import { TokenType } from '../token-types/entities/token-type.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private tokensRepository: Repository<Token>,
    @InjectRepository(TokenType)
    private tokenTypesRepository: Repository<TokenType>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userId: number, createTokenInput: CreateTokenInput) {
    const tokenType = await this.tokenTypesRepository.findOne({
      where: { name: createTokenInput.type },
    });

    if (!tokenType) {
      throw new HttpException(
        `Token Type with name ${createTokenInput.type} doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const author = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!author) {
      throw new HttpException(
        `User with id ${userId} doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newToken = {
      ...createTokenInput,
      type: tokenType,
      author,
    };

    await this.tokensRepository.create(newToken);

    return this.tokensRepository.save(newToken);
  }

  async findAll() {
    const tokens = await this.tokensRepository.find({
      relations: ['author', 'type', 'owner'],
    });

    return tokens.map((item) => {
      if (item.owner) {
        return item;
      }

      return { ...item, owner: { id: null, username: null } as User };
    });
  }

  async findOne(id: number) {
    const token = await this.tokensRepository.findOne({
      where: { id },
      relations: ['author', 'type', 'owner'],
    });

    return {
      ...token,
      owner: token.owner || ({ id: null, username: null } as User),
    };
  }
}
