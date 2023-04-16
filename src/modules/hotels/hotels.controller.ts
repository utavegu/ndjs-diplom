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
  Query,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ValidationPipe } from 'src/helpers/validation.pipe';
import { HotelsRoomsService } from './hotels-rooms.service';
import { HotelsService } from './hotels.service';
import {
  CreateHotelDto,
  CreateHotelRoomDto,
  UpdateHotelParams,
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
import { Role } from 'src/helpers/decorators/role.decorator';
import { Roles } from '../users/typing/enums/roles.enum';
import { LoginedUsersGuard } from 'src/modules/auth/guards/logined-users.guard';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
// import { updateHotelValidationSchema } from './validation/update.hotel.validation.schema';

@Controller()
export class HotelsController {
  constructor(
    private readonly hotelsService: HotelsService,
    private readonly hotelsRoomsService: HotelsRoomsService,
  ) {}

  // Поиск номеров
  @Get('common/hotel-rooms')
  // TODO: Валидация квери-параметров! Валидацию id, кстати, можно через пайп сделать... а как заставить джой валидировать не только боди, но и квери параметры, например? Всё это надо бы валидировать через пайп, исправь
  searchHotelRooms(@Query() { limit, offset, hotel }, @Request() request) {
    if (isNaN(limit) || isNaN(offset)) {
      // классно, только я тут не учитываю, что это вроде необязательные поля...
      throw new BadRequestException('Ошибка в квери параметрах');
    } else {
      return this.hotelsRoomsService.search({
        limit: Number(limit),
        offset: Number(offset),
        hotel: hotel && validateId(hotel),
        isEnabled: request.user === false || request.user.role === Roles.CLIENT,
      });
    }
  }

  // Информация о конкретном номере
  @Get('common/hotel-rooms/:id')
  getTargetRoom(@Param('id') id: ID) {
    return this.hotelsRoomsService.findById(validateId(id));
  }

  // Добавление гостиницы
  @Post('admin/hotels')
  @Role(Roles.ADMIN)
  @UseGuards(LoginedUsersGuard, RoleGuard)
  @UsePipes(new ValidationPipe(createHotelValidationSchema))
  addHotel(@Body() body: CreateHotelDto) {
    return this.hotelsService.create(body);
  }

  // Получение списка гостиниц
  @Get('admin/hotels')
  @Role(Roles.ADMIN)
  @UseGuards(LoginedUsersGuard, RoleGuard)
  getHotels(@Query() { limit, offset }) {
    return this.hotelsService.search({ limit, offset });
  }

  // Изменение описания гостиницы
  @Put('admin/hotels/:id')
  @Role(Roles.ADMIN)
  @UseGuards(LoginedUsersGuard, RoleGuard)
  // @UsePipes(new ValidationPipe(updateHotelValidationSchema)) // TODO: Лучше разобраться с валидацией и пайпами
  editHotel(@Body() body: UpdateHotelParams, @Param('id') id: ID) {
    return this.hotelsService.update(validateId(id), body);
  }

  // Добавление номера
  @Post('admin/hotel-rooms')
  @Role(Roles.ADMIN)
  @UseGuards(LoginedUsersGuard, RoleGuard)
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
  @Role(Roles.ADMIN)
  @UseGuards(LoginedUsersGuard, RoleGuard)
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
  /*
  @Get('test/getimage/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Response() response) {
    const host = 'localhost';
    const port = '3000';
    console.log(image);
    // return response.sendFile(image, { root: './files/img' }); // Можно вот так еще, но мне в данном случае такой способ не подходит
    return response.send(`${host}:${port}/img/${image}`);
  }
  */
}
