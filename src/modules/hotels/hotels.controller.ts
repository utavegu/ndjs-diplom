import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  UseInterceptors,
  UploadedFiles,
  Param,
  Response,
} from '@nestjs/common';
import { AdminRoleGuard } from 'src/helpers/guards/admin.role.guard';
import { ValidationPipe } from 'src/helpers/validation.pipe';
import { HotelsRoomsService } from './hotels-rooms.service';
import { HotelsService } from './hotels.service';
import {
  CreateHotelDto,
  CreateHotelRoomDto,
  UpdateHotelRoomDto,
} from './typing/hotels.interface';
import { createHotelValidationSchema } from './validation/create.hotel.validation.schema';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  FORM_FIELD_NAME,
  MAX_IMAGES_COUNT,
  filesInterceptorSetup,
  imageParseFilePipeInstance,
} from 'src/helpers/multer.setup';
import { ObjectId } from 'mongoose'; // Грязненько, конечно
import { ID } from 'src/types/id';
import { getBooleanValue, getImagesPaths } from './hotels.utils';
import { validateId } from 'src/helpers/idValidator';

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
  getTargetRoom(@Param('id') id: ID) {
    return this.hotelsRoomsService.findById(validateId(id));
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
  editHotel(@Param('id') id: ID) {
    return this.hotelsService.update;
  }

  // Добавление номера
  @Post('admin/hotel-rooms')
  @UseGuards(AdminRoleGuard)
  // @UsePipes(new ValidationPipe(createHotelRoomValidationSchema))
  @UseInterceptors(
    FilesInterceptor(FORM_FIELD_NAME, MAX_IMAGES_COUNT, filesInterceptorSetup),
  )
  addRoom(
    @UploadedFiles(imageParseFilePipeInstance) files: Express.Multer.File[],
    @Body() body: CreateHotelRoomDto,
  ) {
    const images = getImagesPaths(files);
    return this.hotelsRoomsService.create({
      hotel: validateId(body.hotelId) as ObjectId, // Обманул...
      description: body.description,
      images,
    });
  }

  // Изменение описания номера
  @Put('admin/hotel-rooms/:id')
  @UseGuards(AdminRoleGuard)
  // @UsePipes(new ValidationPipe(createHotelRoomValidationSchema))
  @UseInterceptors(
    FilesInterceptor(FORM_FIELD_NAME, MAX_IMAGES_COUNT, filesInterceptorSetup),
  )
  editRoom(
    @UploadedFiles(imageParseFilePipeInstance) files: Express.Multer.File[],
    @Body() body: UpdateHotelRoomDto,
    @Param('id') id: ID,
  ) {
    const isEnabled = getBooleanValue(body.isEnabled);
    const images = getImagesPaths(files);
    return this.hotelsRoomsService.update(validateId(id), {
      hotel: validateId(body.hotelId) as ObjectId, // Снова обманул... но лучше так не делать
      description: body.description,
      isEnabled,
      images,
    });
  }

  // Для тестирования загруженных файлов
  @Get('test/getimage/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Response() response) {
    const host = 'localhost';
    const port = '3000';
    console.log(image);
    // return response.sendFile(image, { root: './files/img' }); // Можно вот так еще, но мне в данном случае такой способ не подходит
    return response.send(`${host}:${port}/img/${image}`);
  }
}
