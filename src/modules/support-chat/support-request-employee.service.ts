/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/types/id';
import { Message, MessageDocument } from './schemas/message.schema';
import { SupportRequest, SupportRequestDocument } from './schemas/support-request.schema';
import { ISupportRequestEmployeeService, MarkMessagesAsReadDto } from './typing/interfaces/support-chat.interface';

@Injectable()
export class SupportRequestEmployeeService implements ISupportRequestEmployeeService {
  constructor(
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    @InjectModel(SupportRequest.name) private SupportRequestModel: Model<SupportRequestDocument>
  ) { }

  // Мне кажется странным, то что этот метод дублируется в работниках и клиентах, тогда как он вообще общий и должен быть в просто суппорт-реквест. По крайней мере у меня получилось сделать, чтобы эта логика корректно работала как для манагера, так и для клиента
  // Метод ISupportRequestEmployeeService.markMessagesAsRead должен выставлять текущую дату в поле readAt всем сообщениям, которые не были прочитаны и были отправлены пользователем.
  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const targetChat = await this.SupportRequestModel.findById(params.supportRequest).populate({
      path: 'messages',
      select: 'author',
    });
    const interlocutorId = targetChat.messages.find(message => message.author.toString() !== params.user).author.toString(); // Однако эта логика работает корректно только если людей в чате не больше 2х.
    console.log('Тот, кто залогинен: ', params.user)
    console.log('Собеседник', interlocutorId)
    await this.MessageModel.updateMany({ author: interlocutorId, readAt: null }, { readAt: new Date() })
    return { success: true };
  }

  // Метод ISupportRequestEmployeeService.getUnreadCount должен возвращать количество сообщений, которые были отправлены пользователем и не отмечены прочитанными.
  async getUnreadCount(supportRequest: ID): Promise<Message[]> {
    throw new Error('Method not implemented.');
  }

  // Метод ISupportRequestEmployeeService.closeRequest должен менять флаг isActive на false.
  async closeRequest(supportRequest: ID): Promise<void> {
    throw new Error('Method not implemented.');
  }

}
