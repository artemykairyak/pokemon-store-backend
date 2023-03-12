import { Injectable } from '@nestjs/common';
import { CreateLinkInput } from './dto/create-link.input';
import { UpdateLinkInput } from './dto/update-link.input';

@Injectable()
export class LinksService {
  create(createLinkInput: CreateLinkInput) {
    return 'This action adds a new link';
  }

  findAll() {
    return `This action returns all links`;
  }

  findOne(id: number) {
    return `This action returns a #${id} link`;
  }

  update(id: number, updateLinkInput: UpdateLinkInput) {
    return `This action updates a #${id} link`;
  }

  remove(id: number) {
    return `This action removes a #${id} link`;
  }
}
