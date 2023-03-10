import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLinkTypeInput } from './dto/create-link-type.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinkType } from './entities/link-type.entity';

@Injectable()
export class LinkTypesService {
  constructor(
    @InjectRepository(LinkType)
    private linkTypeRepository: Repository<LinkType>,
  ) {}

  async create({ name }: CreateLinkTypeInput) {
    const isExist = await this.linkTypeRepository.findOne({
      where: { name },
    });

    if (isExist) {
      throw new HttpException(
        `Link Type with name ${name} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newLinkType = await this.linkTypeRepository.create({ name });

    return await this.linkTypeRepository.save(newLinkType);
  }

  findAll() {
    return this.linkTypeRepository.find();
  }

  findOne(id: number) {
    return this.linkTypeRepository.findOne({
      where: { id },
    });
  }

  async remove(id: number) {
    const linkType = await this.linkTypeRepository.findOne({ where: { id } });

    if (!linkType) {
      throw new NotFoundException(`Link Type with ID ${id} not found`);
    }

    await this.linkTypeRepository.delete(id);
    return true;
  }
}
