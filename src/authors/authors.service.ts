import { Injectable } from '@nestjs/common';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author) private authorsRepository: Repository<Author>,
  ) {}

  create(createAuthorInput: CreateAuthorInput) {
    const newAuthor = this.authorsRepository.create(createAuthorInput);

    return this.authorsRepository.save(newAuthor);
  }

  findAll() {
    return this.authorsRepository.find();
  }

  findOne(id: number) {
    return this.authorsRepository.findOneOrFail({
      where: { id },
      relations: ['cards'],
    });
  }

  update(id: number, updateAuthorInput: UpdateAuthorInput) {
    return `This action updates a #${id} author`;
  }

  remove(id: number) {
    return `This action removes a #${id} author`;
  }
}
