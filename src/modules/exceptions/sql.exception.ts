import { HttpStatus } from '@nestjs/common';
import { LoggedException } from './logged.exception';
import { SqlExceptionError } from '../classes';
import { SequelizeError } from '../interfaces';

export class SqlException extends LoggedException {
    constructor(error: SequelizeError, customMessage?: string) {
        super(
            customMessage || 'Internal server error with database',
            HttpStatus.INTERNAL_SERVER_ERROR,
            new SqlExceptionError(error)
        );
    }
}
