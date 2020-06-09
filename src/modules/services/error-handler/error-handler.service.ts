import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'log4js';
import * as Raven from 'raven';
import { ApplicationTokens } from '../../application-tokens.const';
import { RAVEN_DISPLAY_LIMIT } from '../../constants';
import { Breadcrum } from '../../interfaces/breadcrum.interface';

@Injectable()
export class ErrorHandler {

    constructor(
        @Inject(ApplicationTokens.LoggerToken)
        private readonly logger: Logger
    ) {}

    captureBreadcrumb(breadcrumb: Breadcrum) {
        if (process.env.DEPLOYMENT) {
            Raven.captureBreadcrumb(breadcrumb);
        }
        else {
            this.logger.info(breadcrumb.message, breadcrumb.data ? breadcrumb.data : '');
        }
    }

    captureException(error: Error) {
        if (process.env.DEPLOYMENT) {
            if (this.sizeInBites(error) > RAVEN_DISPLAY_LIMIT) {
                this.captureMessage(`Error with message "${error.message}" is too large and will not have all data displayed.`);
            }

            Raven.captureException(error, (e: any) => {
                if (e) {
                    this.logger.error(e);
                }
            });
        }
        else {
            this.logger.error(error);
        }
    }

    captureMessage(message: string) {
        if (process.env.DEPLOYMENT) {
            Raven.captureMessage(message, (e: any) => {
                if (e) {
                    this.logger.error(e);
                }
            });
        }
        else {
            this.logger.info(message);
        }
    }

    private sizeInBites(object: any) {
        const objectList = [];
        const stack = [object];
        let bytes = 0;

        while (stack.length) {
            const value = stack.pop();

            if (typeof value === 'boolean') {
                bytes += 4;
            }
            else if (typeof value === 'string') {
                bytes += value.length * 2;
            }
            else if (typeof value === 'number') {
                bytes += 8;
            }
            else if (typeof value === 'object' && value !== null) {
                objectList.push(value);
                Object.getOwnPropertyNames(value).forEach((key) => stack.push(value[key]));
            }
        }
        return bytes;
    }
}
