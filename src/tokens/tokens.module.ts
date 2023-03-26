import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokensResolver } from './tokens.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { StatsModule } from '../stats/stats.module';
import { UsersModule } from '../users/users.module';
import { TokenTypesModule } from '../token-types/token-types.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Token]),
    JwtModule.register({
      signOptions: { expiresIn: process.env.JWT_EXPIRE_TIME },
      secret: process.env.JWT_SECRET,
    }),
    StatsModule,
    UsersModule,
    TokenTypesModule,
  ],
  providers: [TokensService, TokensResolver],
})
export class TokensModule {}
