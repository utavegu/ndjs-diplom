/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from 'src/constants';
import { ID } from 'src/types/id';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { CreateHotelDto, IHotelService, SearchHotelParams, UpdateHotelParams } from './typing/hotels.interface';

@Injectable()
export class HotelsService implements IHotelService {
  constructor(@InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>) { }

  async create(data: CreateHotelDto): Promise<Partial<Hotel> & { id: ID }> {
    const newHotel = await this.HotelModel.create(data);
    return {
      id: newHotel._id,
      title: newHotel.title,
      description: newHotel.description,
    }
  }

  async findById(id: ID): Promise<Hotel> {
    return await this.HotelModel.findById(id).select('-__v -createdAt -updatedAt');
  }

  async search(params: SearchHotelParams): Promise<Hotel[]> {
    const {
      limit = DEFAULT_LIMIT,
      offset = DEFAULT_OFFSET,
    } = params;

    return await this.HotelModel.find()
      .limit(limit)
      .skip(offset)
      .select('id title description')
  }

  async update(id: ID, data: UpdateHotelParams): Promise<Hotel> {
    // Тайтл и дескрипшн не достаю из даты, так как должна быть валидация, которая не пропустит лишнее или неподходящее
    return await this.HotelModel.findByIdAndUpdate(
      id,
      {
        ...data,
        updatedAt: new Date().toISOString()
      },
      {
        new: true
      }
    )
    .select('id title description')
  }

}
