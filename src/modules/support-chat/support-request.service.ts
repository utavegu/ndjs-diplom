/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from 'src/constants';
import { ID } from 'src/types/id';
import { Roles } from '../users/typing/enums/roles.enum';
import { Message, MessageDocument } from './schemas/message.schema';
import { SupportRequest, SupportRequestDocument } from './schemas/support-request.schema';
import { GetChatListParams, ISupportRequestService, SendMessageDto } from './typing/interfaces/support-chat.interface';

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  constructor(
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    @InjectModel(SupportRequest.name) private SupportRequestModel: Model<SupportRequestDocument>
  ) { }

  async findSupportRequests(params: GetChatListParams & { limit: number, offset: number }): Promise<SupportRequest[]> {
    const { user, role, isActive, limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET } = params;

    if (role === Roles.CLIENT) {
      return await this.SupportRequestModel
        .find({ user, isActive })
        .limit(limit)
        .skip(offset)
        .select('-__v -user');
    }

    if (role === Roles.MANAGER) {
      return await this.SupportRequestModel
      .find({ user, isActive })
      .limit(limit)
      .skip(offset)
      .populate({ path: 'user', select: 'id name email contactPhone' });
    }
  }

  async sendMessage(data: SendMessageDto): Promise<Message> {
    throw new Error('Method not implemented.');
  }

  async getMessages(supportRequest: ID): Promise<Message[]> {
    throw new Error('Method not implemented.');
  }

  subscribe(handler: (supportRequest: SupportRequest, message: Message) => void): () => void {
    throw new Error('Method not implemented.');
  }

}
