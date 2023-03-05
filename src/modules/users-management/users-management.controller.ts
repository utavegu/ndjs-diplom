import {
  Controller,
  HttpCode,
  HttpStatus,
  UseFilters,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { MyExceptionFilter } from '../../helpers/exception.filter';
import { ISearchUserParams } from '../users/typing/interfaces/ISearchUserParams';
// import { Role } from './role.decorator';
// import { Roles } from '../users/typing/enums/roles.enum';
import { AdminRoleGuard } from './guards/admin.role.guard';
import { ManagerRoleGuard } from './guards/manager.role.guard';

@Controller()
export class UsersManagementController {
  constructor(private readonly usersService: UsersService) {}

  @Get('admin/users')
  // @Role(Roles.ADMIN)
  @UseGuards(AdminRoleGuard)
  @HttpCode(HttpStatus.OK)
  @UseFilters(MyExceptionFilter)
  async fetchUsersForAdmin(
    @Query() queryParams: ISearchUserParams,
  ): Promise<User[]> {
    return await this.usersService.findAll(queryParams);
  }

  @Get('manager/users')
  // @Role(Roles.MANAGER)
  @UseGuards(ManagerRoleGuard)
  @HttpCode(HttpStatus.OK)
  @UseFilters(MyExceptionFilter)
  async fetchUsersForManager(
    @Query() queryParams: ISearchUserParams,
  ): Promise<User[]> {
    return await this.usersService.findAll(queryParams);
  }
}
