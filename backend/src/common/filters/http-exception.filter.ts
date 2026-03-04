import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp()
        const response = context.getResponse()
        const request = context.getRequest()

        const isHttpException: boolean = exception instanceof HttpException;

        const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

        const exceptionResponse = isHttpException ? exception.getResponse() : null

        let message: string | string[] = 'Internal server error';
        let errors: string[] | undefined;

        if(typeof exceptionResponse === 'string') {
            message = exceptionResponse;
        } else if(exceptionResponse && typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
            const rawMessage= (exceptionResponse as {message: string | string[]}).message
            message = rawMessage;
            errors = Array.isArray(rawMessage) ? rawMessage : undefined
        }

        response.status(status).json({
            statusCode: status,
            message,
            errors,
            timestamp: new Date().toISOString(),
            path: request.url
        })
    }
}