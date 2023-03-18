/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/types/id';
import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema';
import { HotelRoomService, SearchRoomsParams } from './typing/hotels.interface';

@Injectable()
export class HotelsRoomsService implements HotelRoomService {
  constructor(@InjectModel(HotelRoom.name) private HotelRoomModel: Model<HotelRoomDocument>) { }

  create(data: Partial<HotelRoom>): Promise<HotelRoom> {
    throw new Error('Method not implemented.');
  }

  findById(id: ID): Promise<HotelRoom> {
    throw new Error('Method not implemented.');
  }

  search(params: SearchRoomsParams): Promise<HotelRoom[]> {
    throw new Error('Method not implemented.');
  }

  update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom> {
    throw new Error('Method not implemented.');
  }

}
