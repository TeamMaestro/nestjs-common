import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { BaseHttpExceptionFilter } from './base-http-exception.filter';
import { PassiveException } from '../exceptions/passive.exception';

@Catch(PassiveException)
export class PassiveHttpExceptionFilter extends BaseHttpExceptionFilter implements ExceptionFilter {
    catch(exception: PassiveException, host: ArgumentsHost) {
        // determine the context type
        const contextType = this.getHostContextType(host);

        // if http, then form response
        if (contextType === 'http') {
            const res: Response = host.switchToHttp().getResponse();

            // get the original exception if it was caught more than once
            exception = this.getInitialException(exception);

            const statusCode = exception.getStatus() || 500;
            const exceptionResponse = {
                statusCode,
                appCode: HttpStatus[statusCode],
                message: exception.getResponse(),
                ...exception.customResponse
            };

            res.status(statusCode).json(exceptionResponse);
        }
    }
}
