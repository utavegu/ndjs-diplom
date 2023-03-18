import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelsRoomsService } from './hotels-rooms.service';
import { HotelsService } from './hotels.service';
import { HotelRoom, HotelRoomSchema } from './schemas/hotel-room.schema';
import { Hotel, HotelSchema } from './schemas/hotel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
  ],
  providers: [HotelsService, HotelsRoomsService],
  controllers: [],
})
export class SupportChatModule {}
