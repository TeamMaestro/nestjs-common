import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class RedirectException extends BaseException {
    redirectPath: string;

    constructor(redirectPath: string) {
        super('RedirectException', 'Redirect', HttpStatus.TEMPORARY_REDIRECT);
        this.redirectPath = redirectPath;
    }
}
