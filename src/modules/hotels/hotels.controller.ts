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
import { CreateHotelDto } from './typing/hotels.interface';
import { createHotelValidationSchema } from './validation/create.hotel.validation.schema';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  FORM_FIELD_NAME,
  MAX_IMAGES_COUNT,
  filesInterceptorSetup,
  imageParseFilePipeInstance,
} from 'src/helpers/multer.setup';

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
  // Гарда админа
  @UseInterceptors(
    FilesInterceptor(FORM_FIELD_NAME, MAX_IMAGES_COUNT, filesInterceptorSetup),
  )
  addRoom(
    @UploadedFiles(imageParseFilePipeInstance) files: Express.Multer.File[],
    @Body() body: any,
  ) {
    console.log('files');
    console.log(files);
    console.log('body');
    console.log(body);
    // return this.hotelsRoomsService.create;
  }

  // Изменение описания номера
  @Put('admin/hotel-rooms/:id')
  editRoom() {
    return this.hotelsRoomsService.update;
  }

  // Для тестирования загруженных файлов
  @Get('test/getimage/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Response() response) {
    console.log(image);
    // TODO: А как отдать сразу несколько?
    const img = response.sendFile(image, { root: './files/img' }); // лишний проброс, просто разбираюсь пока
    console.log(img);
    return img;
  }
}
