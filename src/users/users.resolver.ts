import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaginatedUsersData, PaginateParams } from '../common.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.usersService.createUser(createUserInput);
  }

  @Query(() => PaginatedUsersData)
  async getAllUsers(
    @Args('params') { page, limit }: PaginateParams,
  ): Promise<PaginatedUsersData> {
    const { users, total } = await this.usersService.getAllUsers(page, limit);
    return { data: users, total };
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
