import { HttpStatus } from '@nestjs/common';
import { LoggedException } from './logged.exception';

export class ValidationException extends LoggedException {
    constructor(
        message?: string,
        options?: {
            appCode?: string;
            critical?: boolean;
        }
    ) {
        super('ValidationException', message || 'Request format is invalid', HttpStatus.BAD_REQUEST);

        this.tags.critical = !!options?.critical ? 'true' : 'false';

        if (options?.appCode) {
            this.appCode = options.appCode;
        }
    }
}
