import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';
import {
  SupportRequest,
  SupportRequestSchema,
} from './schemas/support-request.schema';
import { SupportChatGateway } from './support-chat.gateway';
import { SupportRequestService } from './support-request.service';
import { SupportRequestClientService } from './support-request-client.service';
import { SupportRequestEmployeeService } from './support-request-employee.service';
import { SupportChatController } from './support-chat.controller';

// TODOs

// В ТЗ про фильтры, пайпы и интерсепторы для вебсокетов ничего не сказано вроде, но обкатай по полной программе тут, а то забудешь.

// Оповещения должны быть реализованы через механизм EventEmitter

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: SupportRequest.name, schema: SupportRequestSchema },
    ]),
  ],
  providers: [
    SupportChatGateway,
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
  ],
  controllers: [SupportChatController],
})
export class SupportChatModule {}
