import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  UseGuards,
  Post,
  UsePipes,
  Body,
  Request,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { ISearchUserParams } from '../users/typing/interfaces/ISearchUserParams';
// import { Role } from './role.decorator';
// import { Roles } from '../users/typing/enums/roles.enum';
import { createUserValidationSchema } from '../users/create.user.validation.schema';
import { UserDto } from '../users/typing/interfaces/user.dto';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { AdminReturnedUserType } from '../users/typing/types/returned-user.type';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from '../users/typing/enums/roles.enum';
import { LoginedUsersGuard } from 'src/modules/auth/guards/logined-users.guard';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';

@Controller()
@UseGuards(LoginedUsersGuard, RoleGuard)
export class UsersManagementController {
  constructor(private readonly usersService: UsersService) {}

  @Post('admin/users')
  @Role(Roles.ADMIN)
  @HttpCode(HttpStatus.CREATED) // TODO: Вообще он и сам правильно определяет код, так что в этом нет необходимости, по идее...
  @UsePipes(new ValidationPipe(createUserValidationSchema))
  async adminCreateUser(
    @Body() body: UserDto,
    @Request() request,
  ): Promise<AdminReturnedUserType> {
    return await this.usersService.create(body, request.user);
  }

  @Get('admin/users')
  @Role(Roles.ADMIN)
  @HttpCode(HttpStatus.OK)
  async fetchUsersForAdmin(
    @Query() queryParams: ISearchUserParams,
  ): Promise<User[]> {
    return await this.usersService.findAll(queryParams);
  }

  @Get('manager/users')
  @Role(Roles.MANAGER)
  @HttpCode(HttpStatus.OK)
  async fetchUsersForManager(
    @Query() queryParams: ISearchUserParams,
  ): Promise<User[]> {
    return await this.usersService.findAll(queryParams);
  }
}
