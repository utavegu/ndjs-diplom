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
import { AdminRoleGuard } from 'src/helpers/guards/admin.role.guard';
import { ManagerRoleGuard } from 'src/helpers/guards/manager.role.guard';
import { createUserValidationSchema } from '../users/create.user.validation.schema';
import { UserDto } from '../users/typing/interfaces/user.dto';
import { ValidationPipe } from 'src/helpers/validation.pipe';
import { AdminReturnedUserType } from '../users/typing/types/returned-user.type';

@Controller()
export class UsersManagementController {
  constructor(private readonly usersService: UsersService) {}

  @Post('admin/users')
  @UseGuards(AdminRoleGuard)
  @HttpCode(HttpStatus.CREATED) // TODO: Вообще он и сам правильно определяет код, так что в этом нет необходимости, по идее...
  @UsePipes(new ValidationPipe(createUserValidationSchema))
  async adminCreateUser(
    @Body() body: UserDto,
    @Request() request,
  ): Promise<AdminReturnedUserType> {
    return await this.usersService.create(body, request.user);
  }

  @Get('admin/users')
  // @Role(Roles.ADMIN) // TODO: если сможешь починить эту штуку, по-хорошему гарду повесить на весь контроллер
  @UseGuards(AdminRoleGuard)
  @HttpCode(HttpStatus.OK)
  async fetchUsersForAdmin(
    @Query() queryParams: ISearchUserParams,
  ): Promise<User[]> {
    return await this.usersService.findAll(queryParams);
  }

  @Get('manager/users')
  // @Role(Roles.MANAGER)
  @UseGuards(ManagerRoleGuard)
  @HttpCode(HttpStatus.OK)
  async fetchUsersForManager(
    @Query() queryParams: ISearchUserParams,
  ): Promise<User[]> {
    return await this.usersService.findAll(queryParams);
  }
}
