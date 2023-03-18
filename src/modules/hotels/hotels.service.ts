/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/types/id';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { CreateHotelDto, IHotelService, SearchHotelParams, UpdateHotelParams } from './typing/hotels.interface';

@Injectable()
export class HotelsService implements IHotelService {
  constructor(@InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>) { }

  async create(data: CreateHotelDto): Promise<Hotel> {
    return await this.HotelModel.create(data);
  }

  async findById(id: ID): Promise<Hotel> {
    throw new Error('Method not implemented.');
  }

  async search(params: SearchHotelParams): Promise<Hotel[]> {
    throw new Error('Method not implemented.');
  }
  
  async update(id: ID, data: UpdateHotelParams): Promise<Hotel> {
    throw new Error('Method not implemented.');
  }
  
}
