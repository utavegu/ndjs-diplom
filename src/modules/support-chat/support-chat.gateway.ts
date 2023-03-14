/* eslint-disable prettier/prettier */
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
// import { BookCommentsService } from './book-comments.service';


// message: subscribeToChat payload: chatId - Позволяет пользователю с ролью manager или client получать новые сообщения в чате через WebSocket.

@WebSocketGateway({ cors: true })
export class SupportChatGateway {
  constructor(
    // private bookCommentsService: BookCommentsService
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {}

  /*
  @SubscribeMessage('add-comment')
  async addComment(@MessageBody() body: BookCommentDto): Promise<WsResponse> {
    const newComment = await this.bookCommentsService.createBookComment(body);
    return {
      event: 'newCommentFromServer',
      data: newComment,
    }
  }

  @SubscribeMessage('get-all-comments')
  async getAllComments(@MessageBody() body: IBookComment['bookId']): Promise<IBookComment[]> {
    return await this.bookCommentsService.findAllBookComments(body);
  }
  */
}