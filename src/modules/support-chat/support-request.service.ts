/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/types/id';
import { Message, MessageDocument } from './schemas/message.schema';
import { SupportRequest, SupportRequestDocument } from './schemas/support-request.schema';
import { GetChatListParams, ISupportRequestService, SendMessageDto } from './typing/interfaces/support-chat.interface';

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  constructor(
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    @InjectModel(SupportRequest.name) SupportRequestModel: Model<SupportRequestDocument>
  ) { }

  async findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]> {
    throw new Error('Method not implemented.');
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
