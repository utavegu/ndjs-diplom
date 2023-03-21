/* eslint-disable prettier/prettier */
import * as Joi from 'joi';

export const createHotelValidationSchema = Joi.object().keys({
  title: Joi
    .string()
    .min(2)
    .max(40)
    .required(),

  description: Joi
    .string()
    .max(300)
    .optional(),
});