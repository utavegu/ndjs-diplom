import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { UserDto } from '../users/typing/interfaces/user.dto';
import { CreateUserValidationPipeInstance } from '../users/validation/create.user.validation.pipe';

@Controller('api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('client/register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(CreateUserValidationPipeInstance)
  async create(@Body() body: Omit<UserDto, 'role'>): Promise<User> {
    return await this.userService.create(body);
  }
}
