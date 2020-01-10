import { HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';
import { LoggedException } from './logged.exception';
import { AxiosExceptionError } from '../classes';

export class AxiosException extends LoggedException {
    constructor(error: AxiosError, customMessage?: string) {
        super(
            customMessage || 'Internal server error with request',
            HttpStatus.INTERNAL_SERVER_ERROR,
            new AxiosExceptionError(error)
        );
    }
}
