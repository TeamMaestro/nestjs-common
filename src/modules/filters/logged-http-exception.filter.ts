import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { BaseHttpExceptionFilter } from './base-http-exception.filter';
import { LoggedException } from '../exceptions/logged.exception';

@Catch(LoggedException)
export class LoggedHttpExceptionFilter extends BaseHttpExceptionFilter implements ExceptionFilter {
    catch(exception: LoggedException, host: ArgumentsHost) {
        // get the original exception if it was caught more than once
        exception = this.getInitialException(exception) as LoggedException;

        // determine the context type
        const contextType = this.getHostContextType(host);

        // if http, then form response
        if (contextType === 'http') {
            this.errorHandler.captureException(exception);

            const res: Response = host.switchToHttp().getResponse();

            const statusCode = exception.getStatus() || 500;
            const exceptionResponse = {
                statusCode,
                appCode: exception.appCode ?? HttpStatus[statusCode],
                message: exception.getResponse(),
                ...exception.customResponse
            };

            res.status(statusCode).json(exceptionResponse);
        } else {
            return this.handleRpcException(exception, host, true);
        }
    }
}
