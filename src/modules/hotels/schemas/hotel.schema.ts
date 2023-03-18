/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Hotel {

  @Prop({
    required: true,
    unique: false,
  })
  title: string;

  @Prop({
    required: false,
    unique: false,
  })
  description: string;

  @Prop({
    required: true,
    unique: false,
    default: new Date().toISOString(),
  })
  createdAt: Date;

  @Prop({
    required: true,
    unique: false,
    default: new Date().toISOString(),
  })
  updatedAt: Date;

}

export type HotelDocument = Hotel & Document;

export const HotelSchema = SchemaFactory.createForClass(Hotel);
