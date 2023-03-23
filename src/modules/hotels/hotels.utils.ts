import { HotelRoom } from './schemas/hotel-room.schema';

const getImagesPaths = (files: Express.Multer.File[]): HotelRoom['images'] => {
  if (files.length) {
    const images: HotelRoom['images'] = [''];
    images.pop();
    files.forEach((file) => images.push(`/img/${file.filename}`));
    return images;
  }
};

const getBooleanValue = (
  booleanString: 'true' | 'false' | boolean, // Мне кажется, я делаю какую-то хрень...
): boolean => {
  if (booleanString === 'true') {
    return true;
  } else if (booleanString === 'false') {
    return false;
  }
};

export { getImagesPaths, getBooleanValue };
