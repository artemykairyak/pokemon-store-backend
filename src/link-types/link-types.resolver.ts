import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LinkTypesService } from './link-types.service';
import { LinkType } from './entities/link-type.entity';
import { CreateLinkTypeInput } from './dto/create-link-type.input';

@Resolver(() => LinkType)
export class LinkTypesResolver {
  constructor(private readonly linkTypesService: LinkTypesService) {}

  @Mutation(() => LinkType)
  createLinkType(
    @Args('createLinkTypeInput') createLinkTypeInput: CreateLinkTypeInput,
  ) {
    return this.linkTypesService.create(createLinkTypeInput);
  }

  @Query(() => [LinkType])
  getAllLinkTypes() {
    return this.linkTypesService.findAll();
  }

  @Query(() => LinkType)
  getLinkTypeById(@Args('id', { type: () => Int }) id: number) {
    return this.linkTypesService.findOne(id);
  }

  @Mutation(() => Boolean)
  removeLinkType(@Args('id', { type: () => Int }) id: number) {
    return this.linkTypesService.remove(id);
  }
}
