import { HttpStatus } from '@nestjs/common';
import { PassiveException } from './passive.exception';

export class NotFoundException extends PassiveException {
    constructor(
        message?: string,
        options?: {
            appCode?: string;
        }
    ) {
        super('NotFoundException', message || 'Item not found', HttpStatus.NOT_FOUND);

        if (options?.appCode) {
            this.appCode = options.appCode;
        }
    }
}
