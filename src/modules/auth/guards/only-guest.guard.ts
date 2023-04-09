import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants';

// Чтобы в будущем не забыть, поясню зачем такая порнография с двойной гардой. Если не использовать JwtAuthGuard - в значении isUnauthenticated() всегда будет true, а в isAuthenticated() - false

@Injectable()
export class OnlyGuestGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    if (request.isUnauthenticated()) {
      return true;
    } else {
      throw new BadRequestException(
        ERROR_MESSAGES.ONLY_AVAILABLE_NON_AUTHENTICATED_USERS,
      );
    }
  }
}
