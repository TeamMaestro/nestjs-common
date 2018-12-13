import { HttpStatus } from '@nestjs/common';
import { PassiveException } from './passive.exception';

export class UnauthorizedException extends PassiveException {
    constructor(message?: any) {
        super(
            message || 'Unauthorized',
            HttpStatus.UNAUTHORIZED
        );
    }
}
