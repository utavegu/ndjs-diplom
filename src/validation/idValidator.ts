import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';
import { ERROR_MESSAGES } from 'src/constants';
import { ID } from 'src/types/id';

export const validateId = (id: ID): ID => {
  if (Types.ObjectId.isValid(id as string)) {
    return id;
  } else {
    throw new HttpException(ERROR_MESSAGES.INVALID_ID, HttpStatus.BAD_REQUEST);
  }
};
