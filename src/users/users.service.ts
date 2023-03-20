import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { StatsService } from '../stats/stats.service';
import { Operation } from '../types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly statsService: StatsService,
  ) {}

  async createUser(createUserInput: CreateUserInput) {
    const isExist = await this.usersRepository.findOne({
      where: {
        email: createUserInput.email,
        username: createUserInput.username,
      },
    });

    if (isExist) {
      throw new HttpException(
        `User with this email or username already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = this.usersRepository.create(createUserInput);
    await this.statsService.update({ updateField: 'usersCount' }, 'increase');

    return this.usersRepository.save(user);
  }

  getAllUsers() {
    return this.usersRepository.find();
  }

  async getUserByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['links', 'ownedTokens', 'authoredTokens'],
    });

    if (!user) {
      throw new HttpException(
        `User with username ${username} doesn't exists`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['links', 'ownedTokens', 'authoredTokens'],
    });

    if (!user) {
      throw new HttpException(
        `User with id ${id} doesn't exists`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async updateCreatedTokensCount(userId: number, operation: Operation) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    operation === 'increase'
      ? (user.createdTokensCount += 1)
      : (user.createdTokensCount -= 1);
    await this.usersRepository.save(user);

    return true;
  }

  async updateBoughtTokensCount(userId: number, operation: Operation) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    operation === 'increase'
      ? (user.boughtTokensCount += 1)
      : (user.boughtTokensCount -= 1);
    await this.usersRepository.save(user);

    return true;
  }
}
