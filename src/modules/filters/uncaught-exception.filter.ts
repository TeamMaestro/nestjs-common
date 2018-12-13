import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { BaseHttpExceptionFilter } from './base-http-exception.filter';
import { ErrorHandler } from '../services/error-handler/error-handler.service';

const ignoredHttpStatuses = [HttpStatus.NOT_FOUND];

@Catch(Error)
export class UncaughtExceptionFilter extends BaseHttpExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly errorHandler: ErrorHandler
    ) {
        super();
    }

    catch(exception: any, host: ArgumentsHost) {
        const res: Response = host.switchToHttp().getResponse();

        // get the original exception if it was caught more than once
        exception = this.getInitialException(exception);

        // use 405 instead of 403 do to cloudfront's handling of forbidden
        if (exception.status === HttpStatus.FORBIDDEN) {
            exception.status = HttpStatus.METHOD_NOT_ALLOWED;
        }

        const statusCode = exception.status || 500;

        // Handle Stack Traces
        if (ignoredHttpStatuses.indexOf(exception.status) === -1) {
            this.errorHandler.captureException(exception);
        }

        let message;
        if (exception.message) {
            message = exception.message.error || exception.message;
        }
        else {
            message = 'There was an internal server error';
        }

        res.status(statusCode).json({
            statusCode,
            appCode: HttpStatus[statusCode],
            message
        });
    }
}
