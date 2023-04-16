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
import { ValidationPipe } from 'src/validation/validation.pipe';
import { createUserValidationSchema } from '../users/create.user.validation.schema';
import { ClientReturnedUserType } from '../users/typing/types/returned-user.type';
import { OnlyGuestGuard } from 'src/modules/auth/guards/only-guest.guard';
import { LoginedUsersGuard } from 'src/modules/auth/guards/logined-users.guard';
import { Response as ResponseType } from 'express';
import { cookieOptions, responseHeaders } from './auth.config';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('auth/login')
  @UseGuards(OnlyGuestGuard)
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
  @UseGuards(LoginedUsersGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Response({ passthrough: true }) response: ResponseType
  ): Promise<void> {
    response.cookie('token', '', { expires: new Date() });
    // response.clearCookie('token'); Или вот так еще можно, но тут протухание токена не установить. В нем есть какой-то смысл?
    return response.send('Разлогинились успешно!') as unknown as void; // TODO: Как вернуть пустой респонс?
  }

  @Post('client/register')
  @UseGuards(OnlyGuestGuard)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe(createUserValidationSchema))
  async create(
    @Body() body: Omit<UserDto, 'role'>
  ): Promise<ClientReturnedUserType> {
    return await this.usersService.create(body);
  }
}
