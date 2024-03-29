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
import { UsersService } from '../users/users.service';
import { LinkTypesService } from '../link-types/link-types.service';
import { LinkType } from '../link-types/entities/link-type.entity';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private linkRepository: Repository<Link>,
    @InjectRepository(LinkType)
    private linkTypesRepository: Repository<LinkType>,
    private readonly linkTypesService: LinkTypesService,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: number, createLinkInput: CreateLinkInput) {
    const linkType = await this.linkTypesRepository.findOne({
      where: { name: createLinkInput.type },
    });

    if (!linkType) {
      throw new HttpException(
        `Link Type with type ${createLinkInput.type} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const user = await this.usersService.getUserById(userId);

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

  async update(userId: number, updateLinkInput: UpdateLinkInput) {
    const link = await this.linkRepository.findOne({
      where: { user: { id: userId }, type: { name: updateLinkInput.type } },
      relations: ['type'],
    });

    if (!link) {
      throw new NotFoundException(
        `Link with type id ${updateLinkInput.type} not found`,
      );
    }

    const linkType = await this.linkTypesRepository.findOne({
      where: { name: updateLinkInput.type },
    });

    const updatedLink = {
      ...link,
      ...updateLinkInput,
      type: linkType,
    };

    return await this.linkRepository.save(updatedLink);
  }

  async remove(userId: number, linkType: string) {
    const link = await this.linkRepository.findOne({
      where: { type: { name: linkType }, user: { id: userId } },
    });

    if (!link) {
      throw new NotFoundException(`Link with type ${linkType} not found`);
    }

    await this.linkRepository.delete(link);
    return true;
  }
}
