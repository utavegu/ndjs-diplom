/* eslint-disable prettier/prettier */
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  WebSocketServer
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Message } from './schemas/message.schema';
import { SupportRequest } from './schemas/support-request.schema';
import { SupportRequestService } from './support-request.service';
import { Request, UseGuards } from '@nestjs/common';
import { WsAuthenticatedGuard } from '../auth/guards/ws-authenticated.guard';
import { ID } from 'src/types/id';
import { User } from '../users/schemas/user.schema';

// message: subscribeToChat payload: chatId - Позволяет пользователю с ролью manager или client получать новые сообщения в чате через WebSocket.

@WebSocketGateway({ cors: true })
export class SupportChatGateway {
  constructor(private readonly supportRequestsService: SupportRequestService) { }

  @WebSocketServer() server: Server;

  // Позволяет пользователю с ролью manager или client получать новые сообщения в чате через WebSocket
  // message: subscribeToChat payload: chatId
  // @UseGuards(GatewayGuard)
  @SubscribeMessage('subscribeToChat')
  // @OnEvent('newMessage')
  async subscribeHandler(
    @MessageBody('chatId') chatId: string,
    @ConnectedSocket() connectedSocket: Socket,
    @Request() request,
  ) {
    // console.log(request.user);
    // const { user } = connectedSocket.request as unknown as Request & { user: User & { id: ID } };
    // console.log(user);

    const subscribeCallback = (supportRequest: ID, message: Message) => {
      connectedSocket.emit(chatId, message);
      this.server.emit('newMessage', {
        chatId,
        message,
      });
    }

    this.supportRequestsService.subscribe(subscribeCallback);
    /*
    Ого, доигрался:
    (node:845) MaxListenersExceededWarning: (node) warning: possible EventEmitter memory leak detected. 11 listeners added. Use emitter.setMaxListeners() to increase limit.
    (Use `node --trace-warnings ...` to show where the warning was created)
    */
  }
}
