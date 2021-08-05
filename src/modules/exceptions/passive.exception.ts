import { BaseException } from './base.exception';

export class PassiveException extends BaseException {
    constructor(name: string, response: string | object, status: number, error?: Error) {
        super(name, response, status, error);
    }
}
