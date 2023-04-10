/* eslint-disable prettier/prettier */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Statuses } from '../modules/users/typing/enums/statuses.enum';

@Catch(HttpException)
export class ExtendedException implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // TODO: Тут для вебсокетов нужно будет сделать определялку контекста и кондишн
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
