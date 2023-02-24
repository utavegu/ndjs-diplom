import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { UserDto } from './typing/interfaces/user.dto';
import { ID } from 'src/types/id';
import { ISearchUserParams } from './typing/interfaces/ISearchUserParams';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public create(@Body() body: UserDto): Promise<User> {
    return this.usersService.create(body);
  }

  @Get()
  public findAll(@Query() queryParams: ISearchUserParams): Promise<User[]> {
    return this.usersService.findAll(queryParams);
  }

  @Get(':id')
  public getTargetBook(@Param('id') id: ID): Promise<User> {
    return this.usersService.findById(id);
  }
}
