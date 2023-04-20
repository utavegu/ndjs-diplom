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

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_TOKEN_EXPIRES } from 'src/constants';

// TODOs
// В ТЗ про фильтры, пайпы и интерсепторы для вебсокетов ничего не сказано вроде, но обкатай по полной программе тут, а то забудешь.
// Оповещения должны быть реализованы через механизм EventEmitter

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: SupportRequest.name, schema: SupportRequestSchema },
    ]),
    // Не помогает
    PassportModule.register({
      session: true,
    }),
    // Не помогает
    JwtModule.register({
      secret: process.env.SECRET_OR_KEY,
      signOptions: { expiresIn: `${JWT_TOKEN_EXPIRES}s` },
    }),
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
