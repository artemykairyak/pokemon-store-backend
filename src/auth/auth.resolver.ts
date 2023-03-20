import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { LoginUserInput } from './dto/login-user-input';
import { GqlAuthGuard } from './gql-auth-guard';
import { UseGuards } from '@nestjs/common';
import { User } from '../users/user.entity';
import { SignUpUserInput } from './dto/sign-up-user-input';
import { JwtAuthGuard } from './jwt-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context,
  ) {
    return this.authService.login(context.user);
  }

  @Mutation(() => Boolean)
  signUp(@Args('signUpUserInput') signUpUserInput: SignUpUserInput) {
    return this.authService.signUp(signUpUserInput);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  me(@Context() context) {
    const user = context.req?.user;
    return this.authService.me(user.username);
  }
}
