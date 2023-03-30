import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ERROR_MESSAGES } from 'src/constants';

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
      throw new ForbiddenException(ERROR_MESSAGES.DO_NOT_ACCESS_RIGHTS);
    }
  }
}
