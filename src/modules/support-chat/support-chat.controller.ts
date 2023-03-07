import { Controller, Get, Param, HttpStatus, HttpCode } from '@nestjs/common';
import { ID } from 'src/types/id';
import { SupportRequestService } from './support-request.service';
import { SupportRequestClientService } from './support-request-client.service';
import { SupportRequestEmployeeService } from './support-request-employee.service';

@Controller()
export class SupportChatController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
  ) {}

  // @Get(':id')
  // @HttpCode(HttpStatus.OK)
  // async findById(@Param('id') id: ID): Promise<User> {
  //   return await this.usersService.findById(id);
  // }

  /*
API:

POST /api/client/support-requests/ - Позволяет пользователю с ролью client создать обращение в техподдержку.

GET /api/client/support-requests/ - Позволяет пользователю с ролью client получить список обращений для текущего пользователя.

GET /api/manager/support-requests/ - Позволяет пользователю с ролью manager получить список обращений от клиентов.

GET /api/common/support-requests/:id/messages - Позволяет пользователю с ролью manager или client получить все сообщения из чата.

POST /api/common/support-requests/:id/messages - Позволяет пользователю с ролью manager или client отправлять сообщения в чат.

POST /api/common/support-requests/:id/messages/read - Позволяет пользователю с ролью manager или client отправлять отметку, что сообщения прочитаны.

В ГЭТЭВЭЕ БУДЕШЬ ЖИТЬ, А ПОКА ТУТ ДЛЯ ПОНИМАНИЯ ОБЩЕЙ КАРТИНЫ
message: subscribeToChat payload: chatId - Позволяет пользователю с ролью manager или client получать новые сообщения в чате через WebSocket.
*/
}
