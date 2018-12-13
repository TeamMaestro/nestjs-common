import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class RedirectException extends BaseException {
    redirectPath: string;

    constructor(redrectPath: string) {
        super(
            'Redirect',
            HttpStatus.TEMPORARY_REDIRECT
        );
        this.redirectPath = redrectPath;
    }
}
