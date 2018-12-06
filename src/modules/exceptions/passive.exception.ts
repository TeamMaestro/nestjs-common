import { BaseException } from './base.exception';

export class PassiveException extends BaseException {
    constructor(response: string | object, status: number, error?: Error) {
        super(response, status, error);
    }
}
