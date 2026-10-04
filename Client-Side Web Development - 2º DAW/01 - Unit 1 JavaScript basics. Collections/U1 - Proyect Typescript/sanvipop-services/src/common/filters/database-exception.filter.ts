import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import type { Response } from 'express';

@Catch(UniqueConstraintViolationException, NotFoundError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(
    exception: UniqueConstraintViolationException | NotFoundError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof UniqueConstraintViolationException) {
      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        error: 'Conflict',
        message: 'A record with that unique key already exists',
      });
      return;
    }

    if (exception instanceof NotFoundError) {
      response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: exception.message || 'Requested entity not found',
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal database error',
    });
  }
}

