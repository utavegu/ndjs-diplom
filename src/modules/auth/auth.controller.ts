import {
  Controller,
  Get,
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
import { JwtAuthGuard } from './jwt.auth.guard';
import { createUserValidationSchema } from '../users/create.user.validation.schema';
import { ClientReturnedUserType } from '../users/typing/types/returned-user.type';
import { ERROR_MESSAGES } from 'src/constants';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: Omit<UserDto, 'name' | 'contactPhone' | 'role'>,
    @Request() request,
    @Response() response,
  ): Promise<User | string> {
    if (request.isUnauthenticated()) {
      const user = await this.authService.login(body);
      // TODO: Далее сильно не уверен в правильности исполнения
      const token = this.authService.createToken({
        sub: user.email,
        name: user.name,
        role: user.role,
      });
      response.cookie('token', token, { httpOnly: true }); // TODO: Или другое имя куки?
      return response.json({
        email: user.email,
        name: user.name,
        contactPhone: user.contactPhone,
      });
    } else {
      throw new BadRequestException(
        ERROR_MESSAGES.ONLY_AVAILABLE_NON_AUTHENTICATED_USERS,
      );
    }
  }

  @Post('auth/logout')
  @HttpCode(HttpStatus.OK)
  @Header('Authorization', '') // TODO: Не уверен, что это делается так
  async logout(@Request() request, @Response() response): Promise<void> {
    if (request.isAuthenticated()) {
      request.logout((err) => console.log(err)); // C JWT это бесполезная строчка, да?
      response.cookie('token', ''); // TODO: Не уверен, что это делается так
      // TODO: Попробуй понять что имел в виду Денис Владимиров на счёт флага
      return;
    } else {
      throw new BadRequestException(
        ERROR_MESSAGES.ONLY_AVAILABLE_AUTHENTICATED_USERS,
      );
    }
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

  // Ручка для тестирования JWT-токена
  @UseGuards(JwtAuthGuard)
  @Get('/secret')
  getSecret(): string {
    return 'Вы получили доступ к защищенной ручке!';
  }
}
