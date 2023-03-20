import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StatsService } from './stats.service';
import { Stats } from './entities/stats.entity';
import { UpdateStatsInput } from './dto/update-stats.input';

@Resolver(() => Stats)
export class StatsResolver {
  constructor(private readonly statsService: StatsService) {}

  @Query(() => [Stats])
  getStats() {
    return this.statsService.get();
  }

  @Mutation(() => Stats)
  increaseStats(@Args('updateStatsInput') updateStatsInput: UpdateStatsInput) {
    return this.statsService.update(updateStatsInput, 'increase');
  }

  @Mutation(() => Stats)
  decreaseStats(@Args('updateStatsInput') updateStatsInput: UpdateStatsInput) {
    return this.statsService.update(updateStatsInput, 'decrease');
  }
}
