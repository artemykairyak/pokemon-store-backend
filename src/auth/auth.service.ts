import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginUserInput } from './dto/login-user-input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    const isPasswordValid = await bcrypt.compare(password, user?.password);

    if (user && isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: User) {
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
      user,
    };
  }

  async signUp({ username, password }: LoginUserInput) {
    const user = await this.usersService.findOne(username);
    const encryptedPassword = await bcrypt.hash(password, 10);

    if (user) {
      throw new Error('User already exists');
    }

    return this.usersService.create({ username, password: encryptedPassword });
  }
}
