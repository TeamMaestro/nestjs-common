import { LoggedException } from './logged.exception';
import { HttpStatus } from '@nestjs/common';

export class UncaughtException extends LoggedException {
    constructor(error: any) {
        super(
            'Uncaught exception',
            HttpStatus.INTERNAL_SERVER_ERROR,
            error
        );
    }
}
