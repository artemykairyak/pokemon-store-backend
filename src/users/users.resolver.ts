import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.usersService.createUser(createUserInput);
  }

  @Query(() => [User])
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Query(() => User)
  getUserByUsername(@Args('username') username: string) {
    return this.usersService.getUserByUsername(username);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Context() context,
  ) {
    return this.usersService.update(context.req?.user.id, updateUserInput);
  }
}
