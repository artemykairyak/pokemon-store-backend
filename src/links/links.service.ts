import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLinkInput } from './dto/create-link.input';
import { UpdateLinkInput } from './dto/update-link.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './entities/link.entity';
import { LinkType } from '../link-types/entities/link-type.entity';
import { User } from '../users/user.entity';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private linkRepository: Repository<Link>,
    @InjectRepository(LinkType)
    private linkTypeRepository: Repository<LinkType>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userId: number, createLinkInput: CreateLinkInput) {
    const linkType = await this.linkTypeRepository.findOne({
      where: { name: createLinkInput.type },
    });

    if (!linkType) {
      throw new NotFoundException(
        `Link Type "${createLinkInput.type}" not found`,
      );
    }

    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    const isExist = await this.linkRepository.findOne({
      where: { user: { id: userId }, type: { name: createLinkInput.type } },
    });

    if (isExist) {
      throw new HttpException(
        `Link with type ${createLinkInput.type} for user ${userId} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newLink = this.linkRepository.create({
      ...createLinkInput,
      type: linkType,
      user,
    });

    const _newLink = await this.linkRepository.create(newLink);

    return await this.linkRepository.save(_newLink);
  }

  async findAll(userId: number) {
    return await this.linkRepository.find({ where: { user: { id: userId } } });
  }

  async update(userId: number, updateLinkInput: UpdateLinkInput) {
    const link = await this.linkRepository.findOneOrFail({
      where: { user: { id: userId }, type: { name: updateLinkInput.type } },
    });

    const linkType = await this.linkTypeRepository.findOneOrFail({
      where: { name: updateLinkInput.type },
    });

    const updatedLink = {
      ...link,
      ...updateLinkInput,
      type: linkType,
    };

    return await this.linkRepository.save(updatedLink);
  }

  async remove(id: number) {
    const link = await this.linkRepository.findOneOrFail({ where: { id } });

    if (!link) {
      throw new NotFoundException(`Link with ID ${id} not found`);
    }

    await this.linkRepository.delete(id);
    return true;
  }
}
