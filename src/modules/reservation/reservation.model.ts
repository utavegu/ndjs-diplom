/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Reservation {

  @Prop({
    required: true,
    unique: false,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User'
  })
  userId: ObjectId;

  @Prop({
    required: true,
    unique: false,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Hotel'
  })
  hotelId: ObjectId;

  @Prop({
    required: true,
    unique: false,
    type: MongooseSchema.Types.ObjectId,
    ref: 'HotelRoom'
  })
  roomId: ObjectId;

  @Prop({
    required: true,
    unique: false,
    default: new Date().toISOString(),
  })
  dateStart: Date;

  @Prop({
    required: true,
    unique: false,
    default: new Date().toISOString(),
  })
  dateEnd: Date;

}

export type ReservationDocument = Reservation & Document;

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
