/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/types/id';
import { Message, MessageDocument } from './schemas/message.schema';
import { SupportRequest, SupportRequestDocument } from './schemas/support-request.schema';
import { ISupportRequestEmployeeService, MarkMessagesAsReadDto } from './typing/interfaces/support-chat.interface';

/*
    Метод ISupportRequestEmployeeService.getUnreadCount должен возвращать количество сообщений, которые были отправлены пользователем и не отмечены прочитанными.

    Метод ISupportRequestEmployeeService.markMessagesAsRead должен выставлять текущую дату в поле readAt всем сообщениям, которые не были прочитаны и были отправлены пользователем.

    Метод ISupportRequestEmployeeService.closeRequest должен менять флаг isActive на false.
    Оповещения должны быть реализованы через механизм EventEmitter.
*/

@Injectable()
export class SupportRequestEmployeeService implements ISupportRequestEmployeeService {
  constructor(
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    @InjectModel(SupportRequest.name) private SupportRequestModel: Model<SupportRequestDocument>
  ) { }

  markMessagesAsRead(params: MarkMessagesAsReadDto) {
    throw new Error('Method not implemented.');
  }

  async getUnreadCount(supportRequest: ID): Promise<Message[]> {
    throw new Error('Method not implemented.');
  }

  async closeRequest(supportRequest: ID): Promise<void> {
    throw new Error('Method not implemented.');
  }

}
