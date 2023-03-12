import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksResolver } from './links.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Link])],
  providers: [LinksResolver, LinksService],
})
export class LinksModule {}
