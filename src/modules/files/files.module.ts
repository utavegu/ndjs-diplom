import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FilesController } from './files.controller';

@Module({
  imports: [
    MulterModule.register({
      dest: './files/img', // TODO: по хорошему надо ещё посносить директорию файлс и снова опробовать заливку, что он не будет бузить, что такой директории нет
    }),
  ],
  controllers: [FilesController],
  providers: [],
})
export class FilesModule {}
