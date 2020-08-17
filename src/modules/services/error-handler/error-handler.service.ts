import { Inject, Injectable } from '@nestjs/common';
import { StaticErrorHandlerService } from '@teamhive/node-common';
import { Logger } from 'log4js';
import { ApplicationTokens } from '../../application-tokens.const';
import { Breadcrum } from '../../interfaces/breadcrum.interface';

@Injectable()
export class ErrorHandler {
    constructor(
        @Inject(ApplicationTokens.LoggerToken)
        private readonly logger: Logger
    ) {}

    captureBreadcrumb(breadcrumb: Breadcrum) {
        StaticErrorHandlerService.captureBreadcrumb(breadcrumb, this.logger);
    }

    captureException(error: Error) {
        StaticErrorHandlerService.captureException(error, this.logger);
    }

    captureMessage(message: string) {
        StaticErrorHandlerService.captureMessage(message, this.logger);
    }
}
