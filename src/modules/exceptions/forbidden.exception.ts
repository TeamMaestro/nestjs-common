import { HttpStatus } from '@nestjs/common';
import { PassiveException } from './passive.exception';

export class ForbiddenException extends PassiveException {
    constructor(
        message: string = 'Forbidden Action',
        options?: {
            appCode?: string;
        }
    ) {
        super('ForbiddenException', message, HttpStatus.FORBIDDEN);

        if (options?.appCode) {
            this.appCode = options.appCode;
        }
    }
}
