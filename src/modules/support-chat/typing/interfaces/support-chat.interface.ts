/* eslint-disable prettier/prettier */
import { User } from 'src/modules/users/schemas/user.schema';
import { ID } from 'src/types/id';
import { Message } from '../../schemas/message.schema';
import { SupportRequest } from '../../schemas/support-request.schema';

export interface CreateSupportRequestDto {
  user: ID;
  text: string;
}

export interface SendMessageDto {
  author: ID;
  supportRequest: ID;
  text: string;
}

export interface MarkMessagesAsReadDto {
  user: ID;
  supportRequest: ID;
  createdBefore: Date;
}

export interface GetChatListParams {
  user: ID | null;
  isActive: boolean;
  role: User['role'] // Добавил сам, в изначальном интерфейсе не было
}

export interface CreateSupportRequestResponse {
  id: string;
  createdAt: string;
  isActive: boolean;
  hasNewMessages: boolean;
}

export interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
  sendMessage(data: SendMessageDto, request): Promise<Message>; // добавил реквест
  getMessages(supportRequest: ID, request): Promise<Message[]>; // добавил реквест
  // subscribe(
  //   handler: (supportRequest: SupportRequest, message: Message) => void,
  // ): () => void;
  // TODO: Пока поменяю интерфей сабскрайба, так как не понимаю, как он должен работать.
  subscribe(supportRequest: SupportRequest, message: Message): void;
}

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<CreateSupportRequestResponse[]>;
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: ID, request): Promise<number>; // добавил реквест и исправил ошибку интерфейса
}

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: ID, request): Promise<number>; // добавил реквест и исправил ошибку интерфейса
  closeRequest(supportRequest: ID): Promise<void>;
}
