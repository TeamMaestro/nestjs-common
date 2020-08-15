import { Injectable } from '@nestjs/common';
import * as log from 'log4js';
import * as Raven from 'raven';
import { RAVEN_DISPLAY_LIMIT } from '../../constants';
import { Breadcrum } from '../../interfaces/breadcrum.interface';

const logger = log.getLogger('error-handler');

@Injectable()
export class ErrorHandler {
    captureBreadcrumb(breadcrumb: Breadcrum) {
        logger.info(breadcrumb.message, breadcrumb.data ? breadcrumb.data : '');
        Raven.captureBreadcrumb(breadcrumb);
    }

    captureException(error: Error) {
        logger.error(error);
        if (this.sizeInBites(error) > RAVEN_DISPLAY_LIMIT) {
            this.captureMessage(
                `Error with message "${error.message}" is too large and will not have all data displayed.`
            );
        }

        Raven.captureException(error, (e: any) => {
            if (e) {
                logger.error(e);
            }
        });
    }

    captureMessage(message: string) {
        logger.info(message);
        Raven.captureMessage(message, (e: any) => {
            if (e) {
                logger.error(e);
            }
        });
    }

    private sizeInBites(object: any) {
        const objectList = [];
        const stack = [object];
        let bytes = 0;

        while (stack.length) {
            const value = stack.pop();

            if (typeof value === 'boolean') {
                bytes += 4;
            } else if (typeof value === 'string') {
                bytes += value.length * 2;
            } else if (typeof value === 'number') {
                bytes += 8;
            } else if (typeof value === 'object' && value !== null) {
                objectList.push(value);
                Object.getOwnPropertyNames(value).forEach(key => stack.push(value[key]));
            }
        }
        return bytes;
    }
}
