import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../modules/users/typing/enums/roles.enum';

@Injectable()
export class ClientRoleGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

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
    if (user.role !== Roles.CLIENT) {
      throw new ForbiddenException('Доступно только клиентам!');
    }
    return user;
  }
}
