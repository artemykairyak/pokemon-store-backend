import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksResolver } from './links.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { LinkTypesModule } from '../link-types/link-types.module';
import { UsersModule } from '../users/users.module';
import { LinkType } from '../link-types/entities/link-type.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Link, LinkType]),
    JwtModule.register({
      signOptions: { expiresIn: process.env.JWT_EXPIRE_TIME },
      secret: process.env.JWT_SECRET,
    }),
    LinkTypesModule,
    UsersModule,
  ],
  providers: [LinksResolver, LinksService],
})
export class LinksModule {}
