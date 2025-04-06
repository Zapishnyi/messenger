import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch()
export class GlobalHTTPExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status: number;
    let messages: string[];
    // Logger.log('original exception:', exception);
    switch (true) {
      // validation
      case exception instanceof BadRequestException:
        Logger.log('Global exception filter BadRequestException: ');
        status = exception.getStatus();
        messages = (
          exception.getResponse() as {
            message: string[];
          }
        ).message;
        break;

      case exception instanceof HttpException:
        Logger.log('Global exception filter HttpException: ');
        status = exception.getStatus();
        messages = [exception.message];
        break;

      case exception instanceof QueryFailedError:
        Logger.log('Global exception filter QueryFailedError: ');
        status = HttpStatus.CONFLICT;
        messages = [(exception as QueryFailedError).message];
        break;

      case exception instanceof TypeORMError:
        Logger.log('Global exception filter TypeORMError: ');
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        messages = [(exception as TypeORMError).message];
        break;

      case exception instanceof TokenExpiredError:
        Logger.log('Global exception filter TokenExpiredError: ');
        status = HttpStatus.UNAUTHORIZED;
        messages = [(exception as TokenExpiredError).message];
        break;

      case exception instanceof JsonWebTokenError:
        Logger.log('Global exception filter JsonWebTokenError: ');
        status = HttpStatus.UNAUTHORIZED;
        messages = [(exception as JsonWebTokenError).message];
        break;
      case exception instanceof TokenExpiredError:
        Logger.log('Global exception filter TokenExpiredError: ');
        status = HttpStatus.UNAUTHORIZED;
        messages = [(exception as JsonWebTokenError).message];
        break;
      case exception instanceof TypeError:
        Logger.log('Global exception filter TypeError: ');
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        messages = [(exception as TypeError).message];
        break;

      default:
        Logger.log(
          `global http filter: Internal Server error:${(exception as Error).message} `,
        );
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        messages = ['Internal server error'];
    }

    response.status(status).json({
      statusCode: status /*The status code of the error.*/,
      messages,
      timestamp: new Date().toISOString(),
      /*The current time in ISO 8601 format, indicating when the error occurred.*/
      path: request.url /*The URL of the request that caused the error*/,
    });
  }
}
