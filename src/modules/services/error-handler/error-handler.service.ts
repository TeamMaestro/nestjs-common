import { Inject, Injectable, Optional } from '@nestjs/common';
import { StaticErrorHandlerConfiguration, StaticErrorHandlerService } from '@gtindependence/node-common';
import { Logger } from 'log4js';
import { ApplicationTokens } from '../../application-tokens.const';
import { Breadcrum } from '../../interfaces/breadcrum.interface';
import { ErrorHandlerConfigurationToken } from '../../providers/error-handler-configuration/error-handler-configuration.provider';
@Injectable()
export class ErrorHandler {
    constructor(
        @Inject(ApplicationTokens.LoggerToken)
        private readonly logger: Logger,
        @Inject(ErrorHandlerConfigurationToken)
        @Optional()
        private readonly errorHandlerConfiguration?: StaticErrorHandlerConfiguration
    ) {
        this.errorHandlerConfiguration = Object.assign(
            {},
            {
                useSentry: true
            },
            errorHandlerConfiguration ?? {}
        );
    }

    captureBreadcrumb(breadcrumb: Breadcrum) {
        StaticErrorHandlerService.captureBreadcrumb(breadcrumb, this.logger, this.errorHandlerConfiguration);
    }

    captureException(error: Error) {
        return StaticErrorHandlerService.captureException(error, this.logger, this.errorHandlerConfiguration);
    }

    captureMessage(
        message: string,
        tags?: {
            [key: string]: string;
        }
    ) {
        StaticErrorHandlerService.captureMessage(message, this.logger, this.errorHandlerConfiguration, tags);
    }
}
