import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class WsAuthenticatedGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const user1 = client.request.user;
    const user2 = client.handshake.user;

    console.log(user1); // Пусто
    console.log(user2); // Пусто
    // И судя по тому, что undefined, а не false - JwtAuthGuard не отрабатывает

    /*
    const getCookie = (name) => {
      const matches = client.handshake.headers.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    };

    const token = getCookie('token'); // Можно вот отсюда его достать, вынуть данные из пэйлоада и работать с ними, но имхо, это порнография. И ещё есть момент, что логаут не затирает токен из client.handshake.headers.cookie. Ровно как и логин не всегда его туда добавляет... видимо тут важно наличие токена в куках на момент открытия соединения. Да, похоже на то. Логин/логаут + перезагрузка страницы = корректно достающийся тут токен. В общем нерабочий способ.
    console.log(token);
    */

    return user1 || user2;
    // TODO: роль - любой мэнэджер или пользователь, создавший обращение
  }
}
