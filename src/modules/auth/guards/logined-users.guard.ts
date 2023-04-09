import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants';

// Чтобы в будущем не забыть, поясню зачем такая порнография с двойной гардой. Если не использовать JwtAuthGuard, то в значении isUnauthenticated() всегда будет true, а в isAuthenticated() - false

@Injectable()
export class LoginedUsersGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    if (request.isAuthenticated()) {
      return true;
    } else {
      throw new UnauthorizedException(
        ERROR_MESSAGES.ONLY_AVAILABLE_AUTHENTICATED_USERS,
      );
    }
  }
}
