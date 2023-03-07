import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Message } from './message.schema';

@Schema()
export class SupportRequest {
  @Prop({ required: true, unique: false })
  user: ObjectId;

  @Prop({ required: true, unique: false })
  createAt: Date;

  @Prop({ required: false, unique: false })
  messages: [Message];

  @Prop({ required: false, unique: false })
  isActive: boolean;
}

export type SupportRequestDocument = SupportRequest & Document;

// eslint-disable-next-line prettier/prettier
export const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest);
