import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { IUser } from './typing/interfaces/IUser';
import { UserDto } from './typing/interfaces/UserDto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public create(@Body() body: UserDto): Promise<User> {
    return this.usersService.create(body);
  }

  /*
  @Get()
  @HttpCode(HttpStatus.OK)
  public getAllBooks(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public getTargetBook(@Param('id') id: string): Promise<Book> {
    // альтернативный способ извлечения id
    return this.booksService.findOne(id);
  }

  @Delete(':id')
  public delete(@Param() { id }: IParamId): Promise<Book> {
    return this.booksService.delete(id);
  }

  @Put(':id')
  public update(
    @Param() { id }: IParamId,
    @Body() body: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.update(id, body);
  }
  */
}
