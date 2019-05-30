import { LoggedException } from './logged.exception';
import { HttpStatus } from '@nestjs/common';

export class UnhandledPromiseException extends LoggedException {
    constructor(error: any) {
        super(
            'Unhandled promise exception',
            HttpStatus.INTERNAL_SERVER_ERROR,
            error
        );
    }
}
