/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/types/id';
import { Roles } from '../users/typing/enums/roles.enum';
import { Message, MessageDocument } from './schemas/message.schema';
import { SupportRequest, SupportRequestDocument } from './schemas/support-request.schema';
import { CreateSupportRequestDto, CreateSupportRequestResponse, ISupportRequestClientService, MarkMessagesAsReadDto } from './typing/interfaces/support-chat.interface';

@Injectable()
export class SupportRequestClientService implements ISupportRequestClientService {
  constructor(
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    @InjectModel(SupportRequest.name) private SupportRequestModel: Model<SupportRequestDocument>
  ) { }

  async createSupportRequest(data: CreateSupportRequestDto): Promise<CreateSupportRequestResponse[]> {
    const { user, text } = data;
    if (user) {
      // TODO: Тут, пожалуй, следует дергать sendMessage из суппорт-реквеста, для отправки нового сообщения, если чатик уже есть
      const newMessage = await this.MessageModel.create({ author: user, text });
      const appeal = await this.SupportRequestModel.findOne({ user });

      if (!appeal) {
        await this.SupportRequestModel.create({
          user,
          messages: [newMessage],
          createAt: newMessage.sentAt,
        });
      } else {
        await this.SupportRequestModel.findOneAndUpdate(
          { user },
          { $push: { messages: newMessage } },
        )
      }

      const { _id: id, isActive, createAt} = await this.SupportRequestModel.findOne({ user })

      return [{
        id,
        createdAt: String(createAt),
        isActive,
        hasNewMessages: false,
      }];
    }
  }

  // Метод ISupportRequestClientService.markMessagesAsRead должен выставлять текущую дату в поле readAt всем сообщениям, которые не были прочитаны и были отправлены не пользователем.
  markMessagesAsRead(params: MarkMessagesAsReadDto) {
    // Реализован в сервисе работников
    throw new Error('Method not implemented.');
  }

  // Метод ISupportRequestClientService.getUnreadCount должен возвращать количество сообщений, которые были отправлены любым сотрудником поддержки и не отмечены прочитанным.
  async getUnreadCount(supportRequest: ID, request): Promise<number> {
    const managerId = request.user.role === Roles.MANAGER && request.user.id;
    const chat = await this.SupportRequestModel.findById(supportRequest)
      .populate({
        path: 'messages',
        select: 'author readAt',
      });

    const managerUnreadMessagesCount = chat.messages.filter(message => message.author.toString() === managerId && !message.readAt).length;

    return managerUnreadMessagesCount;
  }
}