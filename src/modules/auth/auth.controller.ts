import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  HttpException,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { UserDto } from '../users/typing/interfaces/user.dto';
import { CreateUserValidationPipeInstance } from '../users/validation/create.user.validation.pipe';
import { FindUserExceptionFilter } from '../users/find.user.exception.filter';

@Controller('api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('client/register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(CreateUserValidationPipeInstance)
  @UseFilters(FindUserExceptionFilter)
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
}
