import { HttpStatus } from '@nestjs/common';
import { LoggedException } from './logged.exception';
import { DocumentServiceExceptionError } from '../classes/document-service-error';

export class DocumentServiceException extends LoggedException {
    constructor(error) {
        super(
            'Internal Server Error - DMS',
            HttpStatus.INTERNAL_SERVER_ERROR,
            new DocumentServiceExceptionError(error)
        );
        this.name = 'DocumentServiceException';
    }
}
