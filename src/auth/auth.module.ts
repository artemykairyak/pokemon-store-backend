import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      signOptions: { expiresIn: process.env.JWT_EXPIRE_TIME },
      secret: process.env.JWT_SECRET,
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule,
  ],
  providers: [AuthService, AuthResolver, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
