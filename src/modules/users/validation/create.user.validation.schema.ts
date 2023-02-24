/* eslint-disable prettier/prettier */
import * as Joi from 'joi';

export const createUserValidationSchema = Joi.object().keys({
  email: Joi
    .string()
    // TODO: русские буквы запретить хавать... и вообще разберись что ты такое скопировал из документации
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  
  passwordHash: Joi
    .string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),

  name: Joi
    .string()
    .alphanum() // ?
    .min(2)
    .max(30)
    .required(),

  contactPhone: Joi
    .string()
    // Я не маэстро регулярок, но по-моему ты не должен хавать строку "1112241", а ты хаваешь... Видимо дело в том, что регулярку неправильно вбил. Вон посмотри в пароле - там из документации пример. Возможно есть какие-нибудь специальные маски для этого дела - читай документацию джой
    .pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/)
    .optional(),
  
  role: Joi
    // TODO: только одно из трёх значений
    .string()
    .required(),
});