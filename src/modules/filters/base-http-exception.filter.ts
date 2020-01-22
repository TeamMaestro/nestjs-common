import { HttpStatus } from '@nestjs/common';

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
}
