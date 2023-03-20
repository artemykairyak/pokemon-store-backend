import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokensModule } from './tokens/tokens.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { TokenTypesModule } from './token-types/token-types.module';
import { LinksModule } from './links/links.module';
import { LinkTypesModule } from './link-types/link-types.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      entities: [join(__dirname + '/**/*.entity{.ts,.js}')],
      autoLoadEntities: true,
      connectTimeout: 20000,
      acquireTimeout: 20000,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    TokensModule,
    UsersModule,
    AuthModule,
    TokenTypesModule,
    LinksModule,
    LinkTypesModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  // exports: [JwtModule],
})
export class AppModule {}
