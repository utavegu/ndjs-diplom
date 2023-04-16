/* eslint-disable prettier/prettier */
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Message } from './schemas/message.schema';
import { SupportRequest } from './schemas/support-request.schema';
import { SupportRequestService } from './support-request.service';

import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Request, UseGuards } from '@nestjs/common';
import { WsAuthenticatedGuard } from '../auth/guards/ws-authenticated.guard';

// message: subscribeToChat payload: chatId - Позволяет пользователю с ролью manager или client получать новые сообщения в чате через WebSocket.

@WebSocketGateway({ cors: true })
export class SupportChatGateway {
  constructor(
    private readonly supportRequestsService: SupportRequestService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  // Позволяет пользователю с ролью manager или client получать новые сообщения в чате через WebSocket
  // message: subscribeToChat payload: chatId
  // ГАРДА!!!
  // @UseGuards(GatewayGuard)
  @SubscribeMessage('subscribeToChat')
  // @OnEvent('newMessage')
  async getMessage(
    @MessageBody('chatId') chatId: string,
    @ConnectedSocket() connectedSocket: Socket,
    @Request() request,
    payload: {
      supportRequest: SupportRequest,
      message: Message
    }
  ): Promise<WsResponse> {
    console.log(request.user);
    // const { supportRequest, message } = payload;

    // const { user } = connectedSocket.request as any;
    // console.log(user);
    // console.log('ПРИВЕТ')
    // console.log(supportRequest);
    // console.log(message);

    return 
    // {
    //   event: 'fromServer',
    //   data: message.text,
    // }

  }

  @UseGuards(WsAuthenticatedGuard)
  @SubscribeMessage('message-from-client')
  async addComment(@MessageBody() body): Promise<WsResponse> {
    console.log('ГАРДА ПРОПУСТИЛА!');
    return {
      event: 'ws-server-response',
      data: 'Вы ввели: ' + body,
    }
  }

}

/*
ПЛАН:
- Ивент эммиттер
- Пайпы (валидация), эксепшены и тд. Перечитай теорию
- Устранение ошибки текущей аутентификации
- Авторизация и гарда (гугли на тему аутентификации при работе с вебсокетами)
*/