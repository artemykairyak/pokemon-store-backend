import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserInput: CreateUserInput) {
    const isExist = await this.usersRepository.find({
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
    return this.usersRepository.save(user);
  }

  getAllUsers() {
    return this.usersRepository.find();
  }

  getUserByUsername(username: string) {
    return this.usersRepository.findOne({
      where: { username },
      relations: ['links', 'ownedTokens', 'authoredTokens'],
    });
  }
}
