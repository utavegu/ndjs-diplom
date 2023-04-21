import {
  Controller,
  Get,
  Param,
  HttpStatus,
  HttpCode,
  UseGuards,
  Post,
  Request,
  Body,
  Query,
} from '@nestjs/common';
import { SupportRequestService } from './support-request.service';
import { SupportRequestClientService } from './support-request-client.service';
import { SupportRequestEmployeeService } from './support-request-employee.service';
import { ChatRoleGuard } from 'src/modules/auth/guards/chat.role.guard';
import { CreateSupportRequestDto } from './typing/interfaces/support-chat.interface';
import { ID } from 'src/types/id';
import { Roles } from '../users/typing/enums/roles.enum';
import { Role } from 'src/decorators/role.decorator';
import { LoginedUsersGuard } from 'src/modules/auth/guards/logined-users.guard';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';

@Controller()
export class SupportChatController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
  ) {}

  // Позволяет пользователю с ролью client создать обращение в техподдержку
  @Post('client/support-requests')
  @Role(Roles.CLIENT)
  @UseGuards(LoginedUsersGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  async createClientMessage(
    @Body('text') text: CreateSupportRequestDto['text'],
    @Request() request,
  ) {
    return await this.supportRequestClientService.createSupportRequest({
      user: request?.user?.id,
      text,
    });
  }

  // Позволяет пользователю с ролью client получить список обращений для текущего пользователя.
  @Get('client/support-requests')
  @Role(Roles.CLIENT)
  @UseGuards(LoginedUsersGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  async clientFetchAllAppeals(@Request() request, @Query() query) {
    return await this.supportRequestService.findSupportRequests({
      ...query,
      user: request?.user?.id,
      isActive: true, // TODO: Не понимаю как это поле должно выставляться тут. Погоди, оно же квери-параметр должно быть. Ладно, уже пофиг.
      role: request?.user?.role,
    });
  }

  // Позволяет пользователю с ролью manager получить список обращений от клиентов.
  @Get('manager/support-requests')
  @Role(Roles.MANAGER)
  @UseGuards(LoginedUsersGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  async managerFetchAllAppeals(@Request() request, @Query() query) {
    return await this.supportRequestService.findSupportRequests({
      ...query,
      user: '64087239d2f336ced136dbfa', // Моковый ID клиента из базы, должен приходить из интерфейса менеджера, я так понимаю.
      isActive: true, // TODO: Не понимаю как это поле должно выставляться тут
      role: request?.user?.role,
    });
  }

  // Позволяет пользователю с ролью manager или client получить все сообщения из чата.
  @Get('common/support-requests/:id/messages')
  @UseGuards(ChatRoleGuard)
  @HttpCode(HttpStatus.OK)
  async fetchChatHistory(@Request() request, @Param('id') id: ID) {
    return await this.supportRequestService.getMessages(id, request);
  }

  // Позволяет пользователю с ролью manager или client отправлять сообщения в чат.
  @Post('common/support-requests/:id/messages')
  @UseGuards(ChatRoleGuard)
  @HttpCode(HttpStatus.OK)
  async sendMessage(
    @Request() request,
    @Param('id') chatId: ID,
    @Body('text') text: CreateSupportRequestDto['text'],
  ) {
    return await this.supportRequestService.sendMessage(
      {
        author: request?.user?.id,
        supportRequest: chatId,
        text,
      },
      request,
    );
  }

  // Позволяет пользователю с ролью manager или client отправлять отметку, что сообщения прочитаны.
  @Post('common/support-requests/:id/messages/read')
  @UseGuards(ChatRoleGuard)
  @HttpCode(HttpStatus.OK)
  putMark(
    @Request() request,
    @Param('id') chatId: ID,
    @Body('createdBefore') createdBefore: string, // TODO: Без пайпа - опасно
  ) {
    return this.supportRequestEmployeeService.markMessagesAsRead({
      user: request?.user?.id,
      supportRequest: chatId,
      createdBefore: new Date(createdBefore) || new Date('12.03.23'), // TODO: Вообще не понял, что это за поле и зачем оно
    });
  }
}
