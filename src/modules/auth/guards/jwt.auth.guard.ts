import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Памятка: Сама по себе эта гарда не блокирует доступ (Тогда не совсем корректно, что это гарда, это, скорее, сессия как раз...). Она прикрепляет к request поле user, если аутентификация была успешной и делает рабочими функции request.isUnauthenticated() и request.isAuthenticated(). Без ее использования request.user не существует, даже если логин был успешный (с ней - при неуспешном логине вернет false, при успешном - залогиненного юзера, без нее - всегда undefined)

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
    // if (!user) {
    //   throw new UnauthorizedException(
    //     ERROR_MESSAGES.ONLY_AVAILABLE_AUTHENTICATED_USERS,
    //   );
    // }
    return user;
  }
}
