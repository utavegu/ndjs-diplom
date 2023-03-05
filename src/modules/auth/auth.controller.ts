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
  Request,
  Response,
  Header,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { UserDto } from '../users/typing/interfaces/user.dto';
import { ValidationPipe } from 'src/helpers/validation.pipe';
import { MyExceptionFilter } from '../../helpers/exception.filter';
import { JwtAuthGuard } from './jwt.auth.guard';
import { createUserValidationSchema } from '../users/create.user.validation.schema';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('client/register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe(createUserValidationSchema))
  @UseFilters(MyExceptionFilter)
  async create(@Body() body: Omit<UserDto, 'role'>): Promise<Partial<User>> {
    return await this.usersService.create(body);
  }

  @Post('auth/login')
  // TODO: СТАТУС-КОД
  @UseFilters(MyExceptionFilter)
  async login(
    @Body() body: Omit<UserDto, 'name' | 'contactPhone' | 'role'>,
    @Response() response,
  ): Promise<User | string> {
    const user = await this.authService.login(body);
    // TODO: Далее сильно не уверен в правильности исполнения
    const token = this.authService.createToken({
      email: user.email,
      name: user.name,
      role: user.role,
    });
    response.cookie('token', token, { httpOnly: true });
    return response.json(user);
  }

  @Post('auth/logout')
  // TODO: СТАТУС-КОД
  @Header('Authorization', '') // TODO: Не уверен, что это делается так
  async logout(@Request() request, @Response() response): Promise<void> {
    request.logout((err) => console.log(err)); // C JWT это бесполезная строчка, да?
    response.cookie('token', ''); // TODO: Не уверен, что это делается так
    // TODO: Попробуй понять что имел в виду Денис Владимиров на счёт флага
    return response.send('Разлогинились!');
  }

  // Ручка для тестирования JWT-токена
  @UseGuards(JwtAuthGuard)
  @Get('/secret')
  getSecret(@Request() request): string {
    console.log(request.isAuthenticated()); // Юзер залогинен
    console.log(request.isUnauthenticated()); // Юзер НЕ залогинен
    console.log(request.user); // Что еще можно интересного достать при активной сессии? Отсюда можно достать роль, но делай как в документации Неста написано.
    return 'Вы получили доступ к защищенной ручке!';
  }
}
