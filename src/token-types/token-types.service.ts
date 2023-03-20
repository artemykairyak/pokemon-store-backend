import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTokenTypeInput } from './dto/create-token-type.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenType } from './entities/token-type.entity';

@Injectable()
export class TokenTypesService {
  constructor(
    @InjectRepository(TokenType)
    private tokenTypeRepository: Repository<TokenType>,
  ) {}

  async create(createTokenTypeInput: CreateTokenTypeInput) {
    const isExist = await this.tokenTypeRepository.findOne({
      where: { id: createTokenTypeInput.name.toLowerCase() },
    });

    if (isExist) {
      throw new HttpException(
        `Token Type with name ${createTokenTypeInput.name} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newTokenType = {
      id: createTokenTypeInput.name.toLowerCase(),
      ...createTokenTypeInput,
    };

    await this.tokenTypeRepository.create(newTokenType);

    return await this.tokenTypeRepository.save(newTokenType);
  }

  findAll() {
    return this.tokenTypeRepository.find({
      relations: ['tokens'],
    });
  }

  findOne(id: string) {
    return this.tokenTypeRepository.findOneOrFail({
      where: { id },
      relations: ['tokens'],
    });
  }

  async remove(id: string) {
    const tokenType = await this.tokenTypeRepository.findOne({
      where: { id },
    });

    if (!tokenType) {
      throw new NotFoundException(`Token Type with ID ${id} not found`);
    }

    await this.tokenTypeRepository.delete(id);
    return true;
  }
}
