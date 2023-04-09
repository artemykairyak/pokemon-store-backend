import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { LinksService } from './links.service';
import { Link } from './entities/link.entity';
import { CreateLinkInput } from './dto/create-link.input';
import { UpdateLinkInput } from './dto/update-link.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Link)
export class LinksResolver {
  constructor(private readonly linksService: LinksService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Link)
  createLink(
    @Args('createLinkInput') createLinkInput: CreateLinkInput,
    @Context() context,
  ) {
    const user = context.req?.user;
    return this.linksService.create(user.id, createLinkInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Link)
  updateLink(
    @Args('updateLinkInput') updateLinkInput: UpdateLinkInput,
    @Context() context,
  ) {
    return this.linksService.update(context.req?.user.id, updateLinkInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  removeLink(@Args('type') linkType: string, @Context() context) {
    return this.linksService.remove(context.req?.user.id, linkType);
  }
}
