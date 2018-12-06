import { HttpStatus } from '@nestjs/common';
import { LoggedException } from './logged.exception';

export class DocumentServiceException extends LoggedException {
    constructor(error) {
        super(
            'Internal Server Error - DMS',
            HttpStatus.INTERNAL_SERVER_ERROR,
            error
        );
    }
}
