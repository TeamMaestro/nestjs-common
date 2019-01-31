import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response, Request } from 'express';
import { BaseHttpExceptionFilter } from './base-http-exception.filter';
import { RedirectException } from '../exceptions';

@Catch(RedirectException)
export class RedirectHttpExceptionFilter extends BaseHttpExceptionFilter implements ExceptionFilter {
    catch(exception: RedirectException, host: ArgumentsHost) {
        const res: Response = host.switchToHttp().getResponse();
        const req: Request = host.switchToHttp().getRequest();

        // get the original exception if it was caught more than once
        exception = this.getInitialException(exception);

        // prepend scheme to redirect if exists on request
        let scheme = '';
        if (req['customUrlScheme']) {
            scheme = req['customUrlScheme'];
        }

        res.redirect(`${scheme}${exception.redirectPath}`);
    }
}
