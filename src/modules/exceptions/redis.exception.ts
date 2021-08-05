import { HttpStatus } from '@nestjs/common';
import { LoggedException } from './logged.exception';

export class RedisException extends LoggedException {
    constructor(error?: any) {
        super('RedisException', 'Internal server error with redis', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
}
