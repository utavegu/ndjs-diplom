import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Message {
  /** Автор сообщения */
  @Prop({
    required: true,
    unique: false, // Вообще по логике должно быть уникальным, либо я не понимаю задумку как должно работать
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  author: ObjectId;

  /** Когда отправлено */
  @Prop({
    required: true,
    unique: false,
    default: new Date(),
  })
  sentAt: Date;

  /** Текст сообщения */
  @Prop({
    required: true,
    unique: false,
  })
  text: string;

  /** Когда прочитано */
  @Prop({
    required: false,
    unique: false,
  })
  readAt: Date;
}

export type MessageDocument = Message & Document;

export const MessageSchema = SchemaFactory.createForClass(Message);
