import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { createUserValidationSchema } from './create.user.validation.schema';

@Injectable()
export class CreateUserValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, _metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException(error.message);
    }
    return value;
  }
}

// TODO: Вообще так-то код довольно общий тут, напрасно разбил на именно криейт-юзер. Только схема и меняется, так что верни в прокидывание схемы наружу, а класс и файл переименуй в ValidationPipe и куда-нибудь в корень его... helpers?
// eslint-disable-next-line prettier/prettier
export const CreateUserValidationPipeInstance = new CreateUserValidationPipe(createUserValidationSchema);
