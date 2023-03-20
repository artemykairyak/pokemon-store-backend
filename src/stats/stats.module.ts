import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsResolver } from './stats.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stats } from './entities/stats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stats])],
  providers: [StatsResolver, StatsService],
  exports: [StatsService],
})
export class StatsModule {}
