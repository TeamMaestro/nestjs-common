import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { BaseHttpExceptionFilter } from './base-http-exception.filter';
import { RedirectException } from '../exceptions';

@Catch(RedirectException)
export class RedirectHttpExceptionFilter extends BaseHttpExceptionFilter implements ExceptionFilter {
    catch(exception: RedirectException, host: ArgumentsHost) {
        const res: Response = host.switchToHttp().getResponse();

        // get the original exception if it was caught more than once
        exception = this.getInitialException(exception);

        res.redirect(exception.redirectPath);
    }
}
