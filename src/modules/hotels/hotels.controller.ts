import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AdminRoleGuard } from 'src/helpers/guards/admin.role.guard';
import { ValidationPipe } from 'src/helpers/validation.pipe';
import { HotelsRoomsService } from './hotels-rooms.service';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './typing/hotels.interface';
import { createHotelValidationSchema } from './validation/create.hotel.validation.schema';

@Controller()
export class HotelsController {
  constructor(
    private readonly hotelsService: HotelsService,
    private readonly hotelsRoomsService: HotelsRoomsService,
  ) {}

  // Поиск номеров
  @Get('common/hotel-rooms')
  searchHotelRooms() {
    return this.hotelsRoomsService.search;
  }

  // Информация о конкретном номере
  @Get('common/hotel-rooms/:id')
  getTargetRoom() {
    return this.hotelsRoomsService.findById;
  }

  // Добавление гостиницы
  @Post('admin/hotels')
  @UseGuards(AdminRoleGuard)
  @UsePipes(new ValidationPipe(createHotelValidationSchema))
  addHotel(@Body() body: CreateHotelDto) {
    return this.hotelsService.create(body);
  }

  // Получение списка гостиниц
  @Get('admin/hotels')
  getHotels() {
    return this.hotelsService.search;
  }

  // Изменение описания гостиницы
  @Put('admin/hotels/:id')
  editHotel() {
    return this.hotelsService.update;
  }

  // Добавление номера
  @Post('admin/hotel-rooms')
  addRoom() {
    return this.hotelsRoomsService.create;
  }

  // Изменение описания номера
  @Put('admin/hotel-rooms/:id')
  editRoom() {
    return this.hotelsRoomsService.update;
  }
}
