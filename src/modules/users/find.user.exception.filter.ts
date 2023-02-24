import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Statuses } from './typing/enums/statuses.enum';

@Catch(HttpException)
export class FindUserExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const errorCode = exception.getStatus();
    const errorMessage = exception.getResponse();

    const errorToDatabase = {
      timestamp: new Date().toISOString(), // TODO: В более красивом виде
      status: Statuses.FAIL,
      data: {
        errorMessage,
        path: request.url,
        method: request.method,
      },
      code: errorCode || 500,
    };

    // TODO: асинк-эвэйт база данных.сохранить(errorToDatabase) - логирование ошибок

    response.status(errorCode).json(errorToDatabase);
  }
}
