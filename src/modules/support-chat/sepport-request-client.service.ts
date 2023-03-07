/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/types/id';
import { Message, MessageDocument } from './schemas/message.schema';
import { SupportRequest, SupportRequestDocument } from './schemas/support-request.schema';
import { CreateSupportRequestDto, ISupportRequestClientService, MarkMessagesAsReadDto } from './typing/interfaces/support-chat.interface';

/*
Метод ISupportRequestClientService.getUnreadCount должен возвращать количество сообщений, которые были отправлены любым сотрудником поддержки и не отмечены прочитанным.

Метод ISupportRequestClientService.markMessagesAsRead должен выставлять текущую дату в поле readAt всем сообщениям, которые не были прочитаны и были отправлены не пользователем.
*/

@Injectable()
export class SupportRequestClientService implements ISupportRequestClientService {
  constructor(
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    @InjectModel(SupportRequest.name) SupportRequestModel: Model<SupportRequestDocument>
  ) { }

  async createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest> {
    throw new Error('Method not implemented.');
  }

  markMessagesAsRead(params: MarkMessagesAsReadDto) {
    throw new Error('Method not implemented.');
  }

  async getUnreadCount(supportRequest: ID): Promise<Message[]> {
    throw new Error('Method not implemented.');
  }

}
