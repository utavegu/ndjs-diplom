/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema()
export class HotelRoom {

  @Prop({
    required: true,
    unique: false,
    ref: 'Hotel'
  })
  hotel: ObjectId;

  @Prop({
    required: false,
    unique: false,
  })
  description: string;

  @Prop({
    required: false,
    unique: false,
    default: []
  })
  images: [string];

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

  @Prop({
    required: true,
    unique: false,
    default: true,
  })
  isEnabled: boolean;

}

export type HotelRoomDocument = HotelRoom & Document;

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
