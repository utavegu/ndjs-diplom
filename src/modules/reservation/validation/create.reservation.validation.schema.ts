/* eslint-disable prettier/prettier */
import * as Joi from 'joi';

export const createReservationValidationSchema = Joi.object().keys({
  hotelId: Joi
    .required(),

  roomId: Joi
    .required(),

  dateStart: Joi
    .date()
    .iso()
    .required(),

  dateEnd: Joi
    .date()
    .iso()
    .required(),
});