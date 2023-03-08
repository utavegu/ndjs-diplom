import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Message } from './message.schema';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class SupportRequest {
  /** Автор данного обращения */
  @Prop({
    required: true,
    unique: false,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  user: ObjectId;

  /** Когда создано обращение */
  @Prop({
    required: true,
    unique: false,
  })
  createAt: Date;

  /** Сообщения данной переписки */
  @Prop({
    required: false,
    unique: false,
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Message',
  })
  messages: [Message];

  /** Открыт ли еще вопрос */
  @Prop({
    required: false,
    unique: false,
    default: true,
  })
  isActive: boolean;
}

export type SupportRequestDocument = SupportRequest & Document;

// eslint-disable-next-line prettier/prettier
export const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest);
