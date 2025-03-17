import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { ValidationError } from 'class-validator';
import { Socket } from 'socket.io';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalWSExceptionFilter implements ExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    let status: number;
    let messages: string[];

    const wsContext = host.switchToWs();
    const response = wsContext.getClient<Socket>(); // WebSocket response
    const error = exception.getError()[0];
    // Handle the exception based on the type of error
    switch (true) {
      case exception instanceof BadRequestException:
        status = exception.getStatus();
        messages = (exception.getResponse() as { message: string[] }).message;
        break;

      case error instanceof ValidationError:
        status = HttpStatus.BAD_REQUEST; // Default to unauthorized for WS exceptions
        messages = Object.values(error.constraints || {});
        break;

      case exception instanceof TokenExpiredError:
        status = HttpStatus.UNAUTHORIZED;
        messages = [(exception as TokenExpiredError).message];
        break;

      case exception instanceof JsonWebTokenError:
        status = HttpStatus.UNAUTHORIZED;
        messages = [(exception as JsonWebTokenError).message];
        break;

      case exception instanceof QueryFailedError:
        status = HttpStatus.CONFLICT;
        messages = [(exception as QueryFailedError).message];
        break;

      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        messages = ['Internal server error'];
        break;
    }

    // Emit the error
    response.emit('error', {
      message: `status:${status} | messages:${messages.join(', ')}`,
      // statusCode: status,
    });
  }
}
