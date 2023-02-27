import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard extends AuthGuard('local') {
  constructor(props) {
    super(props);
  }

  // middleware to transform graphql request
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    // getting default request object
    const request = ctx.getContext();
    // adding into request body params from graphql input
    request.body = ctx.getArgs().loginUserInput;

    return request;
  }
}
