/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  UseGuards,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { UserDto } from '../users/typing/interfaces/user.dto';
import { ValidationPipe } from 'src/helpers/validation.pipe';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.auth.guard';
import { createUserValidationSchema } from '../users/create.user.validation.schema';
import { ClientReturnedUserType } from '../users/typing/types/returned-user.type';
import { OnlyGuestGuard } from 'src/modules/auth/guards/only-guest.guard';
import { LoginedUsersGuard } from 'src/modules/auth/guards/logined-users.guard';
import { CookieOptions, Response as ResponseType } from 'express';

// TODO: Этих двух ребят куда-нибудь в конфигурационный файл

// https://expressjs.com/ru/api.html#res.cookie
const cookieOptions: CookieOptions = {
  // Недоступны из JavaScript через свойства document.cookie
  httpOnly: true,
  // С атрибутом Strict куки будут отправляться только тому сайту, которому эти куки принадлежат. Задача - для защиты от CSRF аттак, запретит передачу Cookie файлов если переход к вашему API был не с установленого в Cookie домена
  sameSite: 'strict',
  // Срок действия куки (на лёрнджээс почему-то пишут, что в секундах, но тут работает в миллисекундах)
  maxAge: 30 * 1000, // такое же как и протухание токена, ЕНВ
  // Отсылаются на сервер только по протоколу SSL или HTTPS. Важный параметр для прода!
  // secure: true,
  // те URL-адреса, к которым куки будут отсылаться. По умолчанию куки доступны лишь тому домену, который его установил и не передаются поддомену. Потому лучше оставить по-умолчанию (если укажу как у меня тут ниже, то еще и поддомены будут доступны). При необходимости есть ещё path. Задача - чтобы избежать оверхеда при запросах к статичным файлам (публичным картинкам/стилям/js файлам)
  // domain: 'localhost:3000',
}

const responseHeaders = {
  // TODO: не уверен, что правильно установил (спроси у проверяющего). И самостоятельно поразбирайся в теме установки заголовков. Только ли на эту ручку надо весить, на другие тоже или вообще на уровне настройки сервера (Nginx, Apache)
  'Content-Security-Policy': 'default-src self', // ограничение доверенных доменов для предотвращения возможных XSS атак (вот тут довольно подробно о нем - https://blog.skillfactory.ru/glossary/csp/)
  'X-Frame-Options': 'SAMEORIGIN', // для защиты от атак типа clickjacking
  'X-XSS-Protection': '1; mode=block', // принудительно включить встроенный механизм защиты браузера от XSS атак
  'X-Content-Type-Options': 'nosniff', // для защиты от подмены MIME типов
}

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('auth/login')
  @UseGuards(JwtAuthGuard, OnlyGuestGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: Omit<UserDto, 'name' | 'contactPhone' | 'role'>,
    @Response({ passthrough: true }) response: ResponseType & User,
  ): Promise<User | string> {
    const user = await this.authService.login(body);
    const token = this.authService.createToken({
      sub: user.email,
      name: user.name,
      role: user.role,
    });      
    return response
      .cookie(
        'token', // TODO: Или другое имя куки? Есть ли договоренности на этот счёт?
        token,
        cookieOptions,
      )
      .set(responseHeaders)
      .json({
        email: user.email,
        name: user.name,
        contactPhone: user.contactPhone,
      });
  }

  @Post('auth/logout')
  @UseGuards(JwtAuthGuard, LoginedUsersGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Response({ passthrough: true }) response: ResponseType
  ): Promise<void> {
    response.cookie('token', '', { expires: new Date() });
    // response.clearCookie('token'); Или вот так еще можно, но тут протухание токена не установить. В нем есть какой-то смысл?
    return response.send('Разлогинились успешно!') as unknown as void; // TODO: Как вернуть пустой респонс?
  }

  @Post('client/register')
  @UseGuards(JwtAuthGuard, OnlyGuestGuard)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe(createUserValidationSchema))
  async create(
    @Body() body: Omit<UserDto, 'role'>
  ): Promise<ClientReturnedUserType> {
    return await this.usersService.create(body);
  }
}
