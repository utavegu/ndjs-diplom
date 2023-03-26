/* eslint-disable prettier/prettier */
import * as Joi from 'joi';

export const updateHotelValidationSchema = Joi.object().keys({
  id: Joi.string(),
  body: Joi.object({
    title: Joi.string().min(2).max(40).optional(),
    description: Joi.string().max(300).optional(),
  })
});