import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    const isHttpException: boolean = exception instanceof HttpException;

    const status = isHttpException
      ? (exception as HttpException).getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException ? (exception as HttpException).getResponse() : null;

    let message: string | string[] = 'Internal server error';
    let errors: string[] | undefined;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      const rawMessage = (exceptionResponse as { message: string | string[] })
        .message;
      message = rawMessage;
      errors = Array.isArray(rawMessage) ? rawMessage : undefined;
    }

    const prismaCode =
      typeof exception === 'object' && exception !== null && 'code' in exception
        ? exception.code
        : undefined;

    if (prismaCode === 'P2002') {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: 'Resource already exists.',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    if (prismaCode === 'P2003') {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid related resource.',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    if (prismaCode === 'P2025') {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Resource not found.',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
    
    response.status(status).json({
      statusCode: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
