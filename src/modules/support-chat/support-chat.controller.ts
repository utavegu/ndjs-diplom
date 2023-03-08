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
} from '@nestjs/common';
import { ID } from 'src/types/id';
import { SupportRequestService } from './support-request.service';
import { SupportRequestClientService } from './support-request-client.service';
import { SupportRequestEmployeeService } from './support-request-employee.service';
import { ClientRoleGuard } from 'src/helpers/guards/client.role.guard';
import { CreateSupportRequestDto } from './typing/interfaces/support-chat.interface';

@Controller()
export class SupportChatController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
  ) {}

  // Позволяет пользователю с ролью client создать обращение в техподдержку
  @Post('client/support-requests')
  @UseGuards(ClientRoleGuard)
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

  /*

API:

GET /api/client/support-requests/ - Позволяет пользователю с ролью client получить список обращений для текущего пользователя.

GET /api/manager/support-requests/ - Позволяет пользователю с ролью manager получить список обращений от клиентов.

GET /api/common/support-requests/:id/messages - Позволяет пользователю с ролью manager или client получить все сообщения из чата.

POST /api/common/support-requests/:id/messages - Позволяет пользователю с ролью manager или client отправлять сообщения в чат.

POST /api/common/support-requests/:id/messages/read - Позволяет пользователю с ролью manager или client отправлять отметку, что сообщения прочитаны.

В ГЭТЭВЭЕ БУДЕШЬ ЖИТЬ, А ПОКА ТУТ ДЛЯ ПОНИМАНИЯ ОБЩЕЙ КАРТИНЫ
message: subscribeToChat payload: chatId - Позволяет пользователю с ролью manager или client получать новые сообщения в чате через WebSocket.
*/
}
