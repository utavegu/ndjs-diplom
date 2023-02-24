import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  Query,
  UseFilters,
  HttpException,
  HttpStatus,
  HttpCode,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { UserDto } from './typing/interfaces/user.dto';
import { ID } from 'src/types/id';
import { ISearchUserParams } from './typing/interfaces/ISearchUserParams';
import { FindUserExceptionFilter } from './find.user.exception.filter';
import { CreateUserValidationPipeInstance } from './validation/create.user.validation.pipe';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(CreateUserValidationPipeInstance)
  async create(@Body() body: UserDto): Promise<User> {
    return await this.usersService.create(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() queryParams: ISearchUserParams): Promise<User[]> {
    return await this.usersService.findAll(queryParams);
  }

  // TODO: Так, а я не могу выкидывать эксепшн-то внутри сервиса? Фигово. Могу точнее, но тогда он мне это не как ответ возвращает, а пишет в консоль
  @Get(':id')
  @HttpCode(HttpStatus.OK) // Ага, значит эта штука работает только при успешном сценарии... беру в оборот!
  @UseFilters(FindUserExceptionFilter)
  async findById(@Param('id') id: ID): Promise<User> {
    const result = await this.usersService.findById(id);
    if (result) {
      return result;
    } else {
      throw new HttpException(
        'Такой пользователь не найден!', // TODO: тоже можно в константы или енамки
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
