/* eslint-disable prettier/prettier */
import * as Joi from 'joi';
import { Roles } from './typing/enums/roles.enum';

export const createUserValidationSchema = Joi.object().keys({
  email: Joi
    // поидее тут можно побольше накидать средствами джой, исходя из требований к стандарту почт, но скорее всего регулярка это всё уже предусматривает
    .string()
    .email({
      minDomainSegments: 2, maxDomainSegments: 4
    })
    .pattern(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i)
    .required(),
  
  password: Joi
    .string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),

  name: Joi
    .string()
    .min(2)
    .max(30)
    .required(),

  contactPhone: Joi
    .string()
    .pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/)
    .optional(),
  
  role: Joi
    .string()
    .valid(...Object.values(Roles))
    .optional(), // пока сделаю необязательным, так как скорее всего задаваться она будет в сервисе
});