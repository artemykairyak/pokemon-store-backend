import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Token } from './token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTokenInput } from './dto/create-token.input';
import { TokenType } from '../token-types/entities/token-type.entity';
import { User } from '../users/user.entity';
import { StatsService } from '../stats/stats.service';
import { UsersService } from '../users/users.service';
import { BuyTokenInput } from './dto/buy-token.input';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private tokensRepository: Repository<Token>,
    @InjectRepository(TokenType)
    private tokenTypesRepository: Repository<TokenType>,
    private readonly statsService: StatsService,
    private readonly usersService: UsersService,
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

    const author = await this.usersService.getUserById(userId);

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
    await this.usersService.updateCreatedTokensCount(userId, 'increase');
    await this.statsService.update({ updateField: 'tokensCount' }, 'increase');
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

  async remove(userId: number, id: number) {
    const author = await this.usersService.getUserById(userId);

    if (!author) {
      throw new HttpException(
        `User with id ${userId} doesn't exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = await this.tokensRepository.findOne({
      where: { id, author },
      relations: ['owner', 'author'],
    });

    if (!token) {
      throw new HttpException(
        `Token with id ${id} and with author id ${userId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (token.owner) {
      throw new HttpException(
        `The token will not be deleted because it is purchased`,
        HttpStatus.FORBIDDEN,
      );
    }

    await this.usersService.updateCreatedTokensCount(userId, 'decrease');
    await this.tokensRepository.delete(id);
    await this.statsService.update({ updateField: 'tokensCount' }, 'decrease');
    return true;
  }

  async buy(userId: number, buyTokenInput: BuyTokenInput) {
    const token = await this.tokensRepository.findOne({
      where: { id: buyTokenInput.id },
      relations: ['author', 'type', 'owner'],
    });

    const user = await this.usersService.getUserById(userId);

    if (token.owner) {
      throw new HttpException(
        `This token has already bought`,
        HttpStatus.FORBIDDEN,
      );
    }

    if (token.author.id === userId) {
      throw new HttpException(
        `You cannot buy your own token`,
        HttpStatus.FORBIDDEN,
      );
    }

    if (buyTokenInput.price < token.price) {
      throw new HttpException(`Your price too small`, HttpStatus.FORBIDDEN);
    }

    token.owner = user;
    token.price = buyTokenInput.price;
    await this.tokensRepository.save(token);
    await this.usersService.updateBoughtTokensCount(userId, 'increase');

    return token;
  }
}
