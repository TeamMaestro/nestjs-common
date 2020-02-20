import { HttpStatus } from '@nestjs/common';
import { PassiveException } from './passive.exception';

export class ForbiddenException extends PassiveException {
    constructor(message: string = 'Forbidden Action') {
        super(
            message,
            HttpStatus.FORBIDDEN
        );
    }
}
