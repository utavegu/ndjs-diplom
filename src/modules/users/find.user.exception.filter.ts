/* eslint-disable prettier/prettier */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Statuses } from './typing/enums/statuses.enum';

@Catch(HttpException)
// TODO: Тоже надо было обобщить, он что для файнд, что для криейт, работает одинаково. И тоже в хэлперы сунуть
export class FindUserExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const errorCode = exception.getStatus();
    const errorMessage = exception.getResponse();

    response
      .status(errorCode)
      .json({
        timestamp: new Date().toISOString(), // TODO: В более красивом виде
        status: Statuses.FAIL,
        data: {
          errorMessage,
          path: request.url,
          method: request.method,
        },
        code: errorCode || 500,
      });
  }
}
