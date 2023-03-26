import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpUserInput } from './dto/sign-up-user-input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.getUserByUsername(username, true);
    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password || '',
    );

    if (user && isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }

    throw new Error('Invalid username or password');
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

  async signUp({ username, password, email }: SignUpUserInput) {
    const user = await this.usersRepository.findOne({ where: { username } });
    const encryptedPassword = await bcrypt.hash(password, 10);

    if (user) {
      throw new Error('User already exists');
    }

    await this.usersService.createUser({
      username,
      password: encryptedPassword,
      email,
    });

    return true;
  }

  async me(username: string) {
    return await this.usersService.getUserByUsername(username);
  }
}
