import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { getRandomFileName } from 'src/helpers/utils';

const FORM_FIELD_NAME = 'images';
const MAX_IMAGE_SIZE_IN_BYTES = 5000000; // 5Мб
const MAX_IMAGES_COUNT = 5;

const filesInterceptorSetup = {
  storage: diskStorage({
    destination: './public/img',
    filename: (req, file, callback) => {
      const name = file.originalname.split('.')[0];
      const fileExtName = extname(file.originalname);
      callback(null, `${name}-${getRandomFileName()}${fileExtName}`);
    },
  }),
  limits: {
    fileSize: MAX_IMAGE_SIZE_IN_BYTES, // дублируется в настройках нестового валидатора, использую оба, чтобы не забыть. Этот срабатывает первым! И, кстати, ошибки более информативные выбрасывает
    files: MAX_IMAGES_COUNT, // аналогично параметрам файл интерцептора, лишнее по сути. Оставляю, чтобы помнить о разных вариантах.
  },
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  },
};

const imageParseFilePipeInstance = new ParseFilePipe({
  fileIsRequired: false,
  validators: [
    new MaxFileSizeValidator({ maxSize: MAX_IMAGE_SIZE_IN_BYTES }),
    new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }),
  ],
});

export {
  FORM_FIELD_NAME,
  MAX_IMAGE_SIZE_IN_BYTES,
  MAX_IMAGES_COUNT,
  filesInterceptorSetup,
  imageParseFilePipeInstance,
};
