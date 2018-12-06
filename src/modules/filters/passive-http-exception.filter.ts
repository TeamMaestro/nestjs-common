import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { PassiveException } from '../exceptions/passive.exception';
import { BaseHttpExceptionFilter } from './base-http-exception.filter';

@Catch(PassiveException)
export class PassiveHttpExceptionFilter extends BaseHttpExceptionFilter implements ExceptionFilter {
    catch(exception: PassiveException, host: ArgumentsHost) {
        const res: Response = host.switchToHttp().getResponse();

        // get the original exception if it was caught more than once
        exception = this.getInitialException(exception);

        const statusCode = exception.getStatus() || 500;
        res.status(statusCode).json({
            statusCode,
            appCode: HttpStatus[statusCode],
            message: exception.getResponse()
        });
    }
}
