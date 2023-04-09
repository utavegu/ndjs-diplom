import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ERROR_MESSAGES } from 'src/constants';

/*
TODO: Если получится извлекать юзера в вебсокетной гарде, то нужно будет переделать:
- Определение контекста
- Несколько ролей
- Переименовать файл
*/

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): any {
    const admissionRole = this.reflector.get<string>(
      'role',
      context.getHandler(),
    );
    const { user } = context.switchToHttp().getRequest();
    if (user.role === admissionRole) {
      return true;
    } else {
      throw new ForbiddenException(
        `${user.role}! ${ERROR_MESSAGES.DO_NOT_ACCESS_RIGHTS}`,
        // TODO: Тут для красоты можно словарик сделать, чтобы не admin, а Администратор, например. Только пусть будет с маленькой буквы, будешь еще делать капитализ/апперкейс
      );
    }
  }
}
