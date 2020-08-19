import { ArgumentsHost, ContextType, HttpStatus } from '@nestjs/common';
import * as express from 'express';

export class BaseHttpExceptionFilter {
    getInitialException(exception: any) {
        // use 405 instead of 403 do to cloud front's handling of forbidden
        if (exception.status === HttpStatus.FORBIDDEN) {
            exception.status = HttpStatus.METHOD_NOT_ALLOWED;
        }
        return exception;
    }

    /**
     * check for fields on response specific to http to determine context type
     * @param host
     */
    getHostContextType(host: ArgumentsHost): ContextType {
        const res: express.Response = host.switchToHttp().getResponse();
        if (res.req && res.status && typeof res.status === 'function') {
            return 'http';
        }
        return 'rpc';
    }
}
