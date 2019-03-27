import { HttpStatus } from '@nestjs/common';
import { PassiveException } from './passive.exception';

export class ConflictException extends PassiveException {
    constructor(error: any, conflictDescription: string) {
        super(
            conflictDescription,
            HttpStatus.CONFLICT,
            error
        );
    }
}
