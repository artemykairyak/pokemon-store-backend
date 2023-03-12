import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokensResolver } from './tokens.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Token]), UsersModule],
  providers: [TokensService, TokensResolver],
})
export class TokensModule {}
