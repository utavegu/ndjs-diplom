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

  async create(data: Partial<HotelRoom>): Promise<HotelRoom> {
    return await (await this.HotelRoomModel.create(data)).populate({
      path: 'hotel',
      select: '_id title description',
    }) // TODO: Убрать createdAt, updatedAt и __v
  }

  async findById(id: ID): Promise<HotelRoom> {
    throw new Error('Method not implemented.');
  }

  async search(params: SearchRoomsParams): Promise<HotelRoom[]> {
    throw new Error('Method not implemented.');
  }

  async update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom> {
    const { hotel, description, isEnabled, images: newImages = [] as unknown as HotelRoom['images'] } = data;
    const targetRoomPhotos = (await this.HotelRoomModel.findById(id)).images; // TODO: можно ведь, наверное, только одно конкретно поле дергать как-то, чтобы ненужные поля не тащить из документа? 
    const uniquePhotos = new Set(targetRoomPhotos)
    if (newImages.length) {
      newImages.forEach(newImage => {
        uniquePhotos.add(newImage)  ;
      })
    }
    // TODO: Возвращает с отставанием на 1 шаг, но обновляет в базе актуально (в админке монги покажет правильное значение, после дерганья этой ручки)
    return await this.HotelRoomModel.findByIdAndUpdate(
      id,
      { 
        hotel, 
        description,
        images: Array.from(uniquePhotos),
        updatedAt: new Date().toISOString(),
        isEnabled,
      },
    ).populate({
      path: 'hotel',
      select: '_id title description',
    }) // TODO: Убрать createdAt, updatedAt и __v)
  }

}
