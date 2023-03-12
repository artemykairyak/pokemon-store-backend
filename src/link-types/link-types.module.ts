import { Module } from '@nestjs/common';
import { LinkTypesService } from './link-types.service';
import { LinkTypesResolver } from './link-types.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkType } from './entities/link-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LinkType])],
  providers: [LinkTypesResolver, LinkTypesService],
})
export class LinkTypesModule {}
