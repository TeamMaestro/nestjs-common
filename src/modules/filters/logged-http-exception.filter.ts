import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { empty } from 'rxjs';
import { BaseHttpExceptionFilter } from './base-http-exception.filter';
import { LoggedException } from '../exceptions/logged.exception';
import { ErrorHandler } from '../services/error-handler/error-handler.service';
import beeline = require('@teamhive/honeycomb-beeline');

@Catch(LoggedException)
export class LoggedHttpExceptionFilter extends BaseHttpExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly errorHandler: ErrorHandler
    ) {
        super();
    }

    catch(exception: LoggedException, host: ArgumentsHost) {
        // get the original exception if it was caught more than once
        exception = this.getInitialException(exception) as LoggedException;

        const sentryId = this.errorHandler.captureException(exception);

        if (beeline) {
            beeline.addTraceContext({
                'error.sentryId': sentryId,
                'error.name': Object.getPrototypeOf(exception)?.constructor?.name,
                'error.message': exception.message
            })
        }

        // determine the context type
        const contextType = this.getHostContextType(host);

        // if http, then form response
        if (contextType === 'http') {
            const res: Response = host.switchToHttp().getResponse();

            const statusCode = exception.getStatus() || 500;
            const exceptionResponse = {
                statusCode,
                appCode: HttpStatus[statusCode],
                message: exception.getResponse(),
                ...exception.customResponse
            };

            res.status(statusCode).json(exceptionResponse);
        }
        // if rpc, return an empty observeable
        else {
            return empty();
        }
    }
}
