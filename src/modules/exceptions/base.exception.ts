import { HttpException } from '@nestjs/common';

export class BaseException extends HttpException {
    customResponse: {
        [key: string]: any;
    };

    tags: {
        [key: string]: number | string | boolean | bigint | symbol | null | undefined;
    };

    error: Error;

    loggedMetadata: any;

    constructor(response: string | object, status: number, error?: Error) {
        super(response, status);
        this.error = error;
    }
}
