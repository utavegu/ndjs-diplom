import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { UserDto } from '../users/typing/interfaces/user.dto';
import { CreateUserValidationPipeInstance } from '../users/validation/create.user.validation.pipe';
import { MyExceptionFilter } from '../../helpers/exception.filter';
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
  @UseFilters(MyExceptionFilter)
  // TODO: Ещё должна быть проверка на то, что пользователь не аутентифицирован. Это, видимо, в сессию надо лазить. Разберись, можно ли это сделать "по-некстовому", или только через реквест
  async create(@Body() body: Omit<UserDto, 'role'>): Promise<User> {
    return await this.userService.create(body);
  }

  @Post('auth/login')
  // TODO: СТАТУС-КОД
  @UseFilters(MyExceptionFilter)
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
