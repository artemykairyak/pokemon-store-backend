import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { StatsModule } from '../stats/stats.module';
import { ConfigModule } from '@nestjs/config';
import { Link } from '../links/entities/link.entity';
import { LinkType } from '../link-types/entities/link-type.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Link, LinkType]),
    JwtModule.register({
      signOptions: { expiresIn: process.env.JWT_EXPIRE_TIME },
      secret: process.env.JWT_SECRET,
    }),
    TypeOrmModule.forFeature([User]),
    StatsModule,
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
