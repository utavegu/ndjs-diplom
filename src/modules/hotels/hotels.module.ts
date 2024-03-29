import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelsRoomsService } from './hotels-rooms.service';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { HotelRoom, HotelRoomSchema } from './schemas/hotel-room.schema';
import { Hotel, HotelSchema } from './schemas/hotel.schema';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
    MulterModule.register({
      dest: process.env.IMAGE_STORAGE_DESTINATION, // TODO: по хорошему надо ещё посносить директорию файлс и снова опробовать заливку, что он не будет бузить, что такой директории нет.
    }),
  ],
  providers: [HotelsService, HotelsRoomsService],
  controllers: [HotelsController],
})
export class HotelsModule {}
