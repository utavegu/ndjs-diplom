import {
  Controller,
  Get,
  Param,
  UseFilters,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ID } from 'src/types/id';
import { MyExceptionFilter } from 'src/helpers/exception.filter';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

// TODO: Этого контроллера нет в ТЗ, он для тестов, удалить потом.

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseFilters(MyExceptionFilter)
  async findById(@Param('id') id: ID): Promise<User> {
    return await this.usersService.findById(id);
  }
}
