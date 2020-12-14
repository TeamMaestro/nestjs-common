import { Inject, Injectable, Optional } from '@nestjs/common';
import { StaticErrorHandlerConfiguration, StaticErrorHandlerService } from '@teamhive/node-common';
import { Logger } from 'log4js';
import { ApplicationTokens } from '../../application-tokens.const';
import { BaseException } from '../../exceptions';
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
        if (!errorHandlerConfiguration) {
            this.errorHandlerConfiguration = {
                sanitizeException: true,
                sanitizeStack: {
                    enabled: true,
                    length: 10000
                }
            };
        }
    }

    captureBreadcrumb(breadcrumb: Breadcrum) {
        StaticErrorHandlerService.captureBreadcrumb(breadcrumb, this.logger);
    }

    captureException(error: Error) {
        StaticErrorHandlerService.captureException(this.sanitizeError(error), this.logger, this.errorHandlerConfiguration);
    }

    captureMessage(message: string) {
        StaticErrorHandlerService.captureMessage(message, this.logger);
    }

    sanitizeError(error: Error) {
        const sanitizeException = this.errorHandlerConfiguration.sanitizeException ?? true;
        if (!sanitizeException) {
            return error;
        }
        let name: string;
        let message: string;
        let stack: string;
        let loggedMetadata: any;
        let prototype: any;
        if (error instanceof BaseException) {
            const exception = error;
            const subError = exception.error;
            if (subError) {
                name = subError.name !== 'Error' ? subError.name : undefined;
                stack = subError.stack;
                message = subError.message;
            }
            if (!name) {
                name = exception.name !== 'Error' ? exception.name : undefined;
            }
            if (!stack) {
                stack = exception.stack;
            }
            if (!message) {
                message = exception.message;
            }
            prototype = Object.getPrototypeOf(exception);
            loggedMetadata = exception.loggedMetadata;
        }
        else {
            name = error.name;
            message = error.message;
            stack = error.stack;
            prototype = Object.getPrototypeOf(error);
        }
        const sanitizedError = new Error(message);
        sanitizedError.stack = stack;
        sanitizedError.message = message;
        (sanitizedError as any).loggedMetadata = loggedMetadata;
        (sanitizedError as any).__proto__ = prototype;

        // if there isn't a specific name given, clear the name so the constructor name is used
        if (name) {
            sanitizedError.name = name;
        }
        else {
            // clear the name on the object
            sanitizedError.name = undefined;
            // remove the key from the error
            delete sanitizedError.name;
        }
        return sanitizedError;
    }
}
