import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema()
export class Message {
  @Prop({ required: true, unique: false })
  author: ObjectId;

  @Prop({ required: true, unique: false })
  sentAt: Date;

  @Prop({ required: true, unique: false })
  text: string;

  @Prop({ required: false, unique: false })
  readAt: string;
}

export type MessageDocument = Message & Document;

export const MessageSchema = SchemaFactory.createForClass(Message);
