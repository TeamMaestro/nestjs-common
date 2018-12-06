import { HttpStatus } from '@nestjs/common';

import { LoggedException } from './logged.exception';

export class SqlException extends LoggedException {
    constructor(error: Error, customMessage?: string) {
        super(
            customMessage || 'Internal server error with database',
            HttpStatus.INTERNAL_SERVER_ERROR,
            error
        );
    }
}
