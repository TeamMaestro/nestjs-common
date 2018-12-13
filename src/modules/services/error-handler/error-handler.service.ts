import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'log4js';
import * as Raven from 'raven';
import { ApplicationTokens } from '../../application-tokens.const';
import { Breadcrum } from '../../interfaces/breadcrum.interface';

@Injectable()
export class ErrorHandler {

    constructor(
        @Inject(ApplicationTokens.LoggerToken)
        private readonly logger: Logger
    ) {}

    captureBreadcrumb(breadcrumb: Breadcrum): void {
        if (process.env.DEPLOYMENT) {
            Raven.captureBreadcrumb(breadcrumb);
        }
        else {
            this.logger.info(breadcrumb.message);
        }
    }

    captureException(error: Error): void {
        if (process.env.DEPLOYMENT) {
            Raven.captureException(error);
        }
        else {
            this.logger.error(error);
        }
    }

    captureMessage(message: string): void {
        if (process.env.DEPLOYMENT) {
            Raven.captureMessage(message);
        }
        else {
            this.logger.info(message);
        }
    }

}
