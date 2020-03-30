import { ArgumentsHost, ContextType, HttpStatus } from '@nestjs/common';
import * as express from 'express';

export class BaseHttpExceptionFilter {
    getInitialException(exception: any) {
        let initialException = exception;
        while (true) {
            if (initialException.error &&
                initialException.error.status &&
                initialException.error.message &&
                initialException.error.getStatus
            ) {
                initialException = initialException.error;
            }
            else {
                break;
            }
        }

        // use 405 instead of 403 do to cloud front's handling of forbidden
        if (initialException.status === HttpStatus.FORBIDDEN) {
            initialException.status = HttpStatus.METHOD_NOT_ALLOWED;
        }

        return initialException;
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
