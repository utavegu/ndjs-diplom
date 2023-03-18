/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/types/id';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { IHotelService, SearchHotelParams, UpdateHotelParams } from './typing/hotels.interface';

@Injectable()
export class HotelsService implements IHotelService {
  constructor(@InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>) { }

  create(data: any): Promise<Hotel> {
    throw new Error('Method not implemented.');
  }

  findById(id: ID): Promise<Hotel> {
    throw new Error('Method not implemented.');
  }

  search(params: SearchHotelParams): Promise<Hotel[]> {
    throw new Error('Method not implemented.');
  }
  
  update(id: ID, data: UpdateHotelParams): Promise<Hotel> {
    throw new Error('Method not implemented.');
  }
  
}
