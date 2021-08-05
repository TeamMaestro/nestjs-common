import { HttpStatus } from '@nestjs/common';
import { PassiveException } from './passive.exception';

export class BadRequestException extends PassiveException {
    constructor(
        message?: any,
        options?: {
            appCode?: string;
        }
    ) {
        super('BadRequestException', message || 'Bad Request', HttpStatus.BAD_REQUEST);

        if (options?.appCode) {
            this.appCode = options.appCode;
        }
    }
}
