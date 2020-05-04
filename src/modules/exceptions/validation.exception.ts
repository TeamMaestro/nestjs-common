import { HttpStatus } from '@nestjs/common';
import { LoggedException } from './logged.exception';

export class ValidationException extends LoggedException {
    constructor(message?: string) {
        super(
            message || 'Request format is invalid',
            HttpStatus.BAD_REQUEST
        );
    }
}
