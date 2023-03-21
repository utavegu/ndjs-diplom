/* eslint-disable prettier/prettier */
import * as Joi from 'joi';

export const createHotelRoomValidationSchema = Joi.object().keys({
  description: Joi
    .string()
    .optional(),

  hotelId: Joi
    .string()
    .required(),
});