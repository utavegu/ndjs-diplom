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
import { HotelRoom } from './schemas/hotel-room.schema';
import { ObjectId } from 'mongoose'; // Грязненько, конечно
import { createHotelRoomValidationSchema } from './validation/create.hotel-room.validation.schema';
import { ID } from 'src/types/id';
import { getBooleanValue, getImagesPaths } from './hotels.utils';

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
  @UseGuards(AdminRoleGuard)
  // @UsePipes(new ValidationPipe(createHotelRoomValidationSchema)) // TODO: Видимо из-за того, что формдата, ты не работаешь как надо
  @UseInterceptors(
    FilesInterceptor(FORM_FIELD_NAME, MAX_IMAGES_COUNT, filesInterceptorSetup),
  )
  addRoom(
    @UploadedFiles(imageParseFilePipeInstance) files: Express.Multer.File[],
    @Body() body: CreateHotelRoomDto,
  ) {
    // mockHotelId - 641589634be330baf5eeca70
    const images: HotelRoom['images'] = [''];
    images.pop();
    files.forEach((file) => images.push(`/img/${file.filename}`));
    return this.hotelsRoomsService.create({
      hotel: body.hotelId as ObjectId, // Обманул...
      description: body.description,
      images,
    });
  }

  // Изменение описания номера
  @Put('admin/hotel-rooms/:id')
  @UseGuards(AdminRoleGuard)
  // @UsePipes(new ValidationPipe(createHotelRoomValidationSchema)) // TODO: Видимо из-за того, что формдата, ты не работаешь как надо
  @UseInterceptors(
    FilesInterceptor(FORM_FIELD_NAME, MAX_IMAGES_COUNT, filesInterceptorSetup),
  )
  editRoom(
    @UploadedFiles(imageParseFilePipeInstance) files: Express.Multer.File[],
    @Body() body: UpdateHotelRoomDto,
    @Param('id') id: ID,
  ) {
    // mockHotelRoomId - 6419614269f934af13700cbd
    const isEnabled = getBooleanValue(body.isEnabled);
    const images = getImagesPaths(files);
    return this.hotelsRoomsService.update(id, {
      hotel: body.hotelId as unknown as ObjectId, // Ну совсем дичь какая-то...
      description: body.description,
      isEnabled, // TODO: При валидации разрешить принимать только 2 значения строк, как ты сделал с ролями юзеров. И оно должно быть реквайред? Во всяком случае сыпанёт ошибку, если прилетит андефайн
      images,
    });
  }

  // Для тестирования загруженных файлов
  @Get('test/getimage/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Response() response) {
    const host = 'localhost';
    const port = '3000';
    console.log(image); // vepCaCPa6-yfZH0kSDSxuquCseDo7Rgy6VsOU7g79U8-f361.png - имя файла в директории
    // TODO: А как отдать сразу несколько?
    // Что-то я подзабыл... вспомни, как в курсовой и библиотеке делал. Там вроде картинок не было... а когда фронтом был, как тебе картинки с бэка прилетали? Найди апишку базы...
    // Там оттдается ссылочка вот такого вида: /uploads/2022/12/cover.jpg.43d63bc35e8a8ad8f8fd66cdfa4a97d49d334f020d6ad52884c7d8bbabf61457.jpeg - то есть хоста и порта нет, значит и мне нужно просто отдавать "/img/${image}", но ты это уточни на всякий случай
    // Ссылки на паблик давать мне тут кажется плохой идеей. А "рут" надо в константу или енв
    // return response.sendFile(image, { root: './files/img' }); // Можно вот так еще, но мне в данном случае такой способ не подходит
    return response.send(`${host}:${port}/img/${image}`);
  }
}

/*
3 ближайшие квеста:
1) Парсинг формдаты +
2) Как отдать массив картинок +-
3) Почему "файл из реквайред"? (нельзя не прикрепить картинку) В настройках малтера чтоли что-то? +
*/
