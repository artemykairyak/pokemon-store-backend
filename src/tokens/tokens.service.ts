import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Token } from './token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Like, Repository } from 'typeorm';
import { CreateTokenInput } from './dto/create-token.input';
import { User } from '../users/user.entity';
import { StatsService } from '../stats/stats.service';
import { UsersService } from '../users/users.service';
import { BuyTokenInput } from './dto/buy-token.input';
import { TokenTypesService } from '../token-types/token-types.service';
import { getTokensForResponse } from '../utils/utils';
import { UpdateTokenInput } from './dto/update-token.input';
import { GetRandomTokensInput } from './dto/get-random-tokens.input';
import { TokensFilterParams } from '../common.dto';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private tokensRepository: Repository<Token>,
    private readonly tokenTypesService: TokenTypesService,
    private readonly statsService: StatsService,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: number, createTokenInput: CreateTokenInput) {
    const tokenType = await this.tokenTypesService.findOne(
      createTokenInput.type,
    );

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
      description: createTokenInput.description.replace(/\r?\n/g, '\\n'),
      type: tokenType,
      author,
    };

    await this.tokensRepository.create(newToken);
    await this.usersService.updateCreatedTokensCount(userId, 'increase');
    await this.statsService.update({ updateField: 'tokensCount' }, 'increase');
    return this.tokensRepository.save(newToken);
  }

  async findAll(page: number, limit: number, filters?: TokensFilterParams) {
    const where: FindManyOptions['where'] = {};

    if (filters.types) {
      where.type = In(filters.types.split(','));
    }

    if (filters.search) {
      where.name = Like(`%${filters.search}%`);
    }

    const [tokens, total] = await this.tokensRepository.findAndCount({
      where,
      relations: ['author', 'type', 'owner'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return { tokens: getTokensForResponse(tokens), total };
  }

  async findAllByType(tokenType: string) {
    const type = await this.tokenTypesService.findOne(tokenType);

    if (!type) {
      throw new HttpException(
        `Token Type with name ${tokenType} doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokens = await this.tokensRepository.find({
      where: { type },
      relations: ['author', 'type', 'owner'],
    });

    return getTokensForResponse(tokens);
  }

  async findRandom({ count, username, excludedId }: GetRandomTokensInput) {
    const tokens = await this.tokensRepository
      .createQueryBuilder('token')
      .leftJoinAndSelect('token.author', 'author')
      .leftJoinAndSelect('token.type', 'type')
      .leftJoinAndSelect('token.owner', 'owner')
      .orderBy('RAND()')
      .limit(count);

    if (username) {
      tokens.where('author.username = :username', { username });
    }

    if (excludedId) {
      tokens.andWhere('token.id != :excludedId', { excludedId });
    }

    const res = await tokens.getMany();

    return getTokensForResponse(res);
  }

  async findAllUserTokens(
    username: string,
    owned: boolean,
    page: number,
    limit: number,
  ) {
    const user = await this.usersService.getUserByUsername(username);

    if (!user) {
      throw new HttpException(
        `User with username ${username} doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const whereField = owned
      ? { owner: { username } }
      : { author: { username } };

    const [tokens, total] = await this.tokensRepository.findAndCount({
      where: whereField,
      relations: ['author', 'type', 'owner'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return { tokens: getTokensForResponse(tokens), total };
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

  async update(userId: number, updateTokenInput: UpdateTokenInput) {
    const token = await this.tokensRepository.findOne({
      where: { id: updateTokenInput.id, author: { id: userId } },
      relations: ['author', 'owner', 'type'],
    });

    if (!token) {
      throw new HttpException(
        `Token with id ${updateTokenInput.id} doesn't exists or you are not the author`,
        HttpStatus.FORBIDDEN,
      );
    }

    if (token.owner) {
      throw new HttpException(
        `This token is already purchased`,
        HttpStatus.FORBIDDEN,
      );
    }

    let type;

    if (updateTokenInput.type) {
      type = await this.tokenTypesService.findOne(updateTokenInput.type);

      if (!type) {
        throw new HttpException(
          `Type ${updateTokenInput.type} doesn't exists`,
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const updatedToken = {
      ...token,
      ...updateTokenInput,
      type: type || token.type,
    };

    return await this.tokensRepository.save(updatedToken);
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
}
