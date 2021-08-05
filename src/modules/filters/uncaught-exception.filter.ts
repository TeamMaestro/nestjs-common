import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { BaseHttpExceptionFilter } from './base-http-exception.filter';

const ignoredHttpStatuses = [HttpStatus.NOT_FOUND, HttpStatus.FORBIDDEN, HttpStatus.METHOD_NOT_ALLOWED];

@Catch()
export class UncaughtExceptionFilter extends BaseHttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        // get the original exception if it was caught more than once
        exception = this.getInitialException(exception);



        // determine the context type
        const contextType = this.getHostContextType(host);

        // if http, then form response
        if (contextType === 'http') {
            // handle stack traces
            if (ignoredHttpStatuses.indexOf(exception.status) === -1) {
                this.errorHandler.captureException(exception);
            }

            const res: Response = host.switchToHttp().getResponse();

            const statusCode = exception.status || 500;

            let message;
            if (exception.message) {
                message = exception.message.error || exception.message;
            } else {
                message = 'There was an internal server error';
            }

            const exceptionResponse = {
                statusCode,
                appCode: exception.appCode ?? HttpStatus[statusCode],
                message,
                ...exception.customResponse
            };

            res.status(statusCode).json(exceptionResponse);
        } else {
            return this.handleRpcException(exception, host, true);
        }
    }
}
