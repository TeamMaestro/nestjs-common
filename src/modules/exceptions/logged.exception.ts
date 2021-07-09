import { BaseException } from './base.exception';

export class LoggedException extends BaseException {
    /**
     * These tags will be added to the error when captured in sentry.
     */
    tags: {
        [key: string]: string
    } = {
        critical: 'true'
    };


    constructor(response: string | object, status: number, error?: Error) {
        super(response, status, error);
    }
}
