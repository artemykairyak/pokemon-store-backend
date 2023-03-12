import { Injectable } from '@nestjs/common';
import { CreateTokenTypeInput } from './dto/create-token-type.input';

@Injectable()
export class TokenTypesService {
  create(createTokenTypeInput: CreateTokenTypeInput) {
    return 'This action adds a new tokenType';
  }

  findAll() {
    return `This action returns all tokenTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tokenType`;
  }

  remove(id: number) {
    return `This action removes a #${id} tokenType`;
  }
}
