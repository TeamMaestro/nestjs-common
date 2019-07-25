import { HttpStatus } from '@nestjs/common';
import { LoggedException } from './logged.exception';

export class SsoException extends LoggedException {
    constructor(error?: Error, customMessage?: string) {
        super(
            customMessage || 'Internal server error with SSO',
            HttpStatus.INTERNAL_SERVER_ERROR,
            error
        );
    }
}
