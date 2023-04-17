/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from 'src/constants';
import { ID } from 'src/types/id';
import { Roles } from '../users/typing/enums/roles.enum';
import { Message, MessageDocument } from './schemas/message.schema';
import { SupportRequest, SupportRequestDocument } from './schemas/support-request.schema';
import { GetChatListParams, ISupportRequestService, SendMessageDto } from './typing/interfaces/support-chat.interface';

// TODO: Добавить трайкетчи, необходимые проверки. А в контроллере валидэйшн пайпы. Вообще во всех сервисах чата

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  constructor(
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    @InjectModel(SupportRequest.name) private SupportRequestModel: Model<SupportRequestDocument>,
    private eventEmitter: EventEmitter2
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

  async sendMessage(data: SendMessageDto, request): Promise<Message> {
    const { author, supportRequest, text } = data;
    const chat = await this.SupportRequestModel.findById(supportRequest);

    // TODO: По идее это должно быть в гарде, но не знаю как там достать chat
    if (request?.user?.role === Roles.CLIENT && chat.user.toString() !== request.user.id) {
      throw new ForbiddenException('У вас нет прав доступа!');
    }

    const newMessage = await (await this.MessageModel.create({ author, text })).populate({
      path: 'author',
      select: 'id: _id name'
    });

    await chat.updateOne({ $push: { messages: newMessage } });

    this.eventEmitter.emit('newMessage', {
      supportRequest,
      message: newMessage,
    });

    /*
    this.eventEmitter.on('newMessage', ({ supportRequest, message }) => {
      console.log(`В чате ${supportRequest} новое сообщение "${message.text}" от ${message.author.name}`);
    })
    */

    // TODO: Понять как возвращать без __v
    return newMessage;
  }

  async getMessages(supportRequest: ID, request): Promise<Message[]> {
    const chat = await this.SupportRequestModel.findById(supportRequest)
      .populate({
        path: 'messages',
        select: '-__v',
        populate: {
          path: 'author',
          select: 'id: _id name'
        },
      });

    // TODO: По идее это должно быть в гарде, но не знаю как там достать chat
    if (request?.user?.role === Roles.CLIENT && chat.user.toString() !== request.user.id) {
      throw new ForbiddenException('У вас нет прав доступа!');
    }

    return chat.messages;
  }

  subscribe(handler: (supportRequest: ID, message: Message) => void): () => void {
    this.eventEmitter.on('newMessage', handler);
    this.eventEmitter.on('newMessage', ({ supportRequest, message }) => {
      handler(supportRequest, message);
    });
    console.log('SUBSCRIBE')
    return;
  }
}
