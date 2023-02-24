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

// eslint-disable-next-line prettier/prettier
export const CreateUserValidationPipeInstance = new CreateUserValidationPipe(createUserValidationSchema);
