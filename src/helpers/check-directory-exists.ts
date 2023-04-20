import * as fs from 'fs';
import { join } from 'path';

/** Утилита для проверки и создания (в случае необходимости) нужных директорий. Пустые папки на гит*аб не улетают, потому с этим могут быть проблемы у тех, кто форкает проект, так как при обращении к несуществующему каталогу вылетит ошибка */
export const checkDirectoryExists = (directoryPath: string): void => {
  // Вообще внимательнее с этой штукой, так как у меня есть подозрение, что в продакшене может борода получиться
  const dirPath = join(__dirname, '../..', directoryPath);

  const createCallback = (error) => {
    if (error) {
      throw Error(error);
    }
  };

  fs.stat(dirPath, (error) => {
    if (!error) {
      // console.log('Такая директория уже существует');
    } else if (error.code === 'ENOENT') {
      fs.mkdir(dirPath, createCallback);
    }
  });
};
