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
    @Response() response,
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
      'token',
      token,
      // { httpOnly: true }, // По-взрослому эта строчка нужна, но через статику мешает мне тестить
    ); // TODO: Или другое имя куки?
    return response.json({
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
    });
  }

  @Post('auth/logout')
  @UseGuards(JwtAuthGuard, LoginedUsersGuard)
  @HttpCode(HttpStatus.OK)
  // @Header('Authorization', '') // TODO: Не уверен, что это делается так
  async logout(@Request() request, @Response() response): Promise<void> {
    console.log('ДОСТУП ПОЛУЧЕН');
    /*
    request.logout((err) => console.log(err)); // C JWT это бесполезная строчка, да?
    response.cookie('token', ''); // TODO: Не уверен, что это делается так
    // TODO: Попробуй понять что имел в виду Денис Владимиров на счёт флага
    */
    return;
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
