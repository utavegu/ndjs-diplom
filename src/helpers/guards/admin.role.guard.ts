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
export class AdminRoleGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  public canActivate(context: ExecutionContext) {
    // const role = this.reflector.get<string>('role', context.getHandler()); // Тут ок вытаскивается, но смысла в этом нет
    // const request = context.switchToHttp().getRequest();
    // const user = request.user; // TODO: Почему ты не вытаскиваешься отсюда?
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
    if (user.role !== Roles.ADMIN) {
      throw new ForbiddenException('Доступно только администраторам!');
    }
    return user;
  }
}
