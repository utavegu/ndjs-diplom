import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Request } from 'express';
import { User } from 'src/modules/users/schemas/user.schema';
// import { IUser } from 'src/modules/users/types/i-user';
// import { ERRORS_USER } from 'src/modules/users/users.constants';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class WsAuthenticatedGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    const socket = context.switchToWs().getClient();
    const { request } = socket;
    let isValidUser = false;
    if (request.user) {
      const { user } = request as Request & { user: User };
      if (user.role === 'client' || user.role === 'manager') {
        isValidUser = true;
      }
    }

    if (isValidUser) {
      return isValidUser && request.isAuthenticated();
    }

    throw new WsException('Пользователь не залогинен!');
  }
}
