import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/types/id';
import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema';
import { HotelRoomService, SearchRoomsParams } from './typing/hotels.interface';

@Injectable()
export class HotelsRoomsService implements HotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private HotelRoomModel: Model<HotelRoomDocument>,
  ) {}

  async create(data: Partial<HotelRoom>): Promise<HotelRoom> {
    return await (
      await this.HotelRoomModel.create(data)
    ).populate({
      path: 'hotel',
      select: '_id title description',
    }); // TODO: Убрать createdAt, updatedAt и __v... Хм... снизу сработало, а тут как...
  }

  async findById(id: ID): Promise<HotelRoom> {
    return await this.HotelRoomModel.findById(id)
      .select('-__v -createdAt -updatedAt -isEnabled')
      .populate({
        path: 'hotel',
        select: '_id title description',
      });
  }

  async search(params: SearchRoomsParams): Promise<HotelRoom[]> {
    throw new Error('Method not implemented.');
  }

  async update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom> {
    const {
      hotel,
      description,
      isEnabled,
      images: newImages = [] as unknown as HotelRoom['images'],
    } = data;
    const targetRoom = await this.HotelRoomModel.findById(id);
    if (targetRoom.hotel.toString() !== String(hotel)) {
      throw new NotFoundException('В данном отеле нет такого номера!');
    }
    return await this.HotelRoomModel.findByIdAndUpdate(
      id,
      {
        hotel,
        description,
        images: targetRoom.images.concat(newImages),
        updatedAt: new Date().toISOString(),
        isEnabled,
      },
      { new: true },
    )
      .select('-__v -createdAt -updatedAt')
      .populate({
        path: 'hotel',
        select: '_id title description',
      });
  }
}
