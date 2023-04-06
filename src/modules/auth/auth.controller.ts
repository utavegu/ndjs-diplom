/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  UseGuards,
  Request,
  Response,
  Header,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { UserDto } from '../users/typing/interfaces/user.dto';
import { ValidationPipe } from 'src/helpers/validation.pipe';
import { JwtAuthGuard } from 'src/helpers/guards/jwt.auth.guard';
import { createUserValidationSchema } from '../users/create.user.validation.schema';
import { ClientReturnedUserType } from '../users/typing/types/returned-user.type';
import { ERROR_MESSAGES } from 'src/constants';
import { OnlyGuestGuard } from 'src/helpers/guards/only-guest.guard';
import { LoginedUsersGuard } from 'src/helpers/guards/logined-users.guard';
import { CookieOptions, Request as RequestType, Response as ResponseType } from 'express';

  // TODO: ДОДЕЛАТЬ
  // А, ну вот тут собственно можно посмотреть, как это делается средстами Экспресса: https://expressjs.com/ru/api.html#res.cookie
const setCookieOptions: CookieOptions = {
  // По-взрослому эта строчка нужна, но через статику мешает мне тестить (не доступны из JavaScript через свойства Document.cookie)
  httpOnly: true,
  // С атрибутом Strict куки будут отправляться только тому сайту, которому эти куки принадлежат.
  sameSite: 'strict', 
  // Отсылаются на сервер только по протоколу SSL или HTTPS, за правильность написания не уверен
  // secure: true,
  // те URL-адреса, к которым куки будут отсылаться. По умолчанию куки доступны лишь тому домену, который его установил и не передаются поддомену. Потому лучше оставить по-умолчанию (если укажу как у меня тут ниже, то еще и поддомены будут доступны)
  // domain: 'localhost:3000',
  // expires: до того же времени, что и токен
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
  // @Header([('Cache-Control', 'none'), ('Cache-Control', 'none')]) -- СКОРЕЕ ВСЕГО УДОБНЕЕ БУДЕТ ЭТО СДЕЛАТЬ ЧЕРЕЗ РЕСПОНС, КАК И КУКИ, РАЗ УЖ ТЫ ИСПОЛЬЗУЕШЬ РЕСПОНС ТУТ. response.append для этого используется https://expressjs.com/ru/api.html#res.append
  async login(
    @Body() body: Omit<UserDto, 'name' | 'contactPhone' | 'role'>,
    @Response(
      // { passthrough: true }
    ) response: ResponseType & User,
  ): Promise<User | string> {
    const user = await this.authService.login(body);
    // TODO: Далее сильно не уверен в правильности исполнения
    const token = this.authService.createToken({
      sub: user.email,
      name: user.name,
      role: user.role,
    });
    // eslint-disable-next-line prettier/prettier
    response.cookie(
      'token', // TODO: Или другое имя куки? Есть ли договоренности на этот счёт?
      token,
      setCookieOptions,
    );
    // response.headers('Cache-Control', 'none') --- чот заругался на такое
    return response.json({
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
    });
  }

  @Post('auth/logout')
  @UseGuards(JwtAuthGuard, LoginedUsersGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Request() request: RequestType,
    @Response({ passthrough: true }) response: ResponseType
  ): Promise<void> {
    response.cookie('token', '', { expires: new Date() });
    // response.clearCookie('token'); Или вот так еще можно, но тут протухание токена не установить
    return response.send('Разлогинились успешно!') as unknown as void; // TODO: Как вернуть пустой респонс?
    // TODO: Попробуй понять что имел в виду Денис Владимиров на счёт флага. Вроде уже не надо
  }

  @Post('client/register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe(createUserValidationSchema))
  async create(
    @Body() body: Omit<UserDto, 'role'>,
    @Request() request,
  ): Promise<ClientReturnedUserType> {
    if (request.isUnauthenticated()) {
      return await this.usersService.create(body);
    } else {
      throw new BadRequestException(
        ERROR_MESSAGES.ONLY_AVAILABLE_NON_AUTHENTICATED_USERS,
      );
    }
  }
}
