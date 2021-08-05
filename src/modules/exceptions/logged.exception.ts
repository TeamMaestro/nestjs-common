import { BaseException } from './base.exception';

export class LoggedException extends BaseException {
    /**
     * These tags will be added to the error when captured in sentry.
     */
    tags: {
        [key: string]: string;
    } = {
        critical: 'true'
    };

    constructor(name: string, response: string | object, status: number, error?: Error) {
        super(name, response, status, error);
    }
}
