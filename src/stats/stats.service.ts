import { Injectable } from '@nestjs/common';
import { UpdateStatsInput } from './dto/update-stats.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Stats } from './entities/stats.entity';
import { Repository } from 'typeorm';
import { Operation } from '../types';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Stats) private statsRepository: Repository<Stats>,
  ) {}

  get() {
    return this.statsRepository.find();
  }

  async update({ updateField }: UpdateStatsInput, operation: Operation) {
    const stats = await this.statsRepository.findOne({
      where: { id: 1 },
    });

    if (operation === 'increase') {
      stats[updateField] += 1;
    }

    if (operation === 'decrease') {
      stats[updateField] -= 1;
    }

    return await this.statsRepository.save(stats);
  }
}
