import { HttpStatus } from '@nestjs/common';
import { PassiveException } from './passive.exception';

export class ProcessingException extends PassiveException {
    constructor(message?: string) {
        super(
            message || 'Processing',
            HttpStatus.ACCEPTED
        );
    }
}
