import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  HttpException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { UserDto } from '../users/typing/interfaces/user.dto';
import { CreateUserValidationPipeInstance } from '../users/validation/create.user.validation.pipe';
import { FindUserExceptionFilter } from '../users/find.user.exception.filter';
import { JwtAuthGuard } from './jwt.auth.guard';

@Controller('api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('client/register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(CreateUserValidationPipeInstance)
  @UseFilters(FindUserExceptionFilter) // TODO: А этих ребят можно на сервис весить? Хотя HttpException по-моему там будет тоже в консоль выкидываться, а не в ответ... но если попробовать его возвращать...
  // TODO: Ещё должна быть проверка на то, что пользователь не аутентифицирован
  async create(@Body() body: Omit<UserDto, 'role'>): Promise<User> {
    const result = await this.userService.create(body);
    if (result) {
      return result;
    } else {
      throw new HttpException(
        'Такой пользователь уже зарегистрирован!', // TODO: тоже можно в енамки (эксепшн мессаджес)
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('auth/login')
  async login(
    @Body() body: Omit<UserDto, 'name' | 'contactPhone' | 'role'>,
  ): Promise<User> {
    return this.authService.login(body);
  }

  // Ручка для тестирования JWT-токена, удалить
  @UseGuards(JwtAuthGuard)
  @Get('/secret')
  getSecret(): string {
    return 'Вы получили доступ к защищенной ручке!';
  }
}
