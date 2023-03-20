import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }

  canActivate(context) {
    const request = this.getRequest(context);
    const token = request.headers.authorization?.split(' ')[1];

    try {
      request.user = this.jwtService.decode(token);
      return super.canActivate(context);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
