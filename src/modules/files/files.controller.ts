import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFiles,
  Param,
  Response,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  FORM_FIELD_NAME,
  MAX_IMAGES_COUNT,
  filesInterceptorSetup,
  imageParseFilePipeInstance,
} from './multer.setup';

@Controller()
export class FilesController {
  // constructor() {} Вероятно, сервис тут всё-таки будет.

  // TODO: Вспомни как обрабатывать малтипарт формдату
  @Post('test/addimages')
  @UseInterceptors(
    FilesInterceptor(FORM_FIELD_NAME, MAX_IMAGES_COUNT, filesInterceptorSetup),
  )
  async addImages(
    @UploadedFiles(imageParseFilePipeInstance) files: Express.Multer.File[],
    // @Body() dto: any, // Хотя пусть пока будет, тут же порепетируешь работу с формдатой, если это не прикрепленные файлы
  ) {
    console.log(files);
    const response = [];
    files.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
      };
      response.push(fileReponse);
    });
    // return response;
    return files;
    // files.forEach(file => {
    //   console.log(file.buffer.toString());
    // });
    // return this.hotelsRoomsService.create(files, dto);
  }

  @Get('test/getimage/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Response() response) {
    console.log(image);
    // TODO: А как отдать сразу несколько?
    return response.sendFile(image, { root: './files/img' });
  }
}
