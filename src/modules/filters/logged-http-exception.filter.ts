import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { BaseHttpExceptionFilter } from './base-http-exception.filter';
import { LoggedException } from '../exceptions/logged.exception';
import { ErrorHandler } from '../services/error-handler/error-handler.service';

@Catch(LoggedException)
export class LoggedHttpExceptionFilter extends BaseHttpExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly errorHandler: ErrorHandler
    ) {
        super();
    }

    catch(exception: LoggedException, host: ArgumentsHost) {
        const res: Response = host.switchToHttp().getResponse();

        // get the original exception if it was caught more than once
        exception = this.getInitialException(exception);

        // Handle Stack Traces
        if (exception.error) {
            this.errorHandler.captureException(exception.error);
        }

        const statusCode = exception.getStatus() || 500;
        res.status(statusCode).json({
            statusCode,
            appCode: HttpStatus[statusCode],
            message: exception.getResponse()
        });
    }
}
