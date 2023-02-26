import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public handleRequest(err: any, user: any, _info: any) {
    if (err) {
      throw err;
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
