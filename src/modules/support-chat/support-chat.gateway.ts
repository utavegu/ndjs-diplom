/* eslint-disable prettier/prettier */
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
// import { BookCommentsService } from './book-comments.service';


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