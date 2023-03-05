import {
  Controller,
  Get,
  Param,
  Query,
  UseFilters,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ID } from 'src/types/id';
import { MyExceptionFilter } from 'src/helpers/exception.filter';
import { ISearchUserParams } from './typing/interfaces/ISearchUserParams';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseFilters(MyExceptionFilter)
  async findAll(@Query() queryParams: ISearchUserParams): Promise<User[]> {
    return await this.usersService.findAll(queryParams);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseFilters(MyExceptionFilter)
  async findById(@Param('id') id: ID): Promise<User> {
    return await this.usersService.findById(id);
  }
}
