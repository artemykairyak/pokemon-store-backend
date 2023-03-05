import { Injectable } from '@nestjs/common';
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

  createUser(createUserInput: CreateUserInput) {
    const user = this.usersRepository.create(createUserInput);
    return this.usersRepository.save(user);
  }

  getAllUsers() {
    return this.usersRepository.find();
  }

  getUserByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }
}
