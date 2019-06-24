import * as config from 'config';
import * as log from 'log4js';
import { TryCatchOptions } from '../interfaces/try-catch-options.interface';
import { TryCatchException } from '../interfaces';
import { ErrorHandler } from '../services';

// jank logger
let level: string;
try {
    level = config.get('logger.level');
}
catch (error) {
    level = 'debug';
}
const logger = log.getLogger();
logger.level = level;

// jank error handler
const errorHandler = new ErrorHandler(logger);

export function TryCatch(options = {} as TryCatchOptions) {

    // helper function to pass appropriate arguments to exception
    const getException = (error: any, Exception: TryCatchException) => {
        if (new Exception(error).error) {
            if (options.customResponseMessage) {
                return new Exception(error, options.customResponseMessage);
            }
            return new Exception(error);
        }

        if (options.customResponseMessage) {
            return new Exception(options.customResponseMessage);
        }
        return new Exception();
    };

    const catchError = (error: any, handleOnly: boolean) => {
        // get exception instance if there is an exception option
        let exception: TryCatchException;
        if (options.exception) {
            exception = getException(error, options.exception);
        }

        // if handler passed in capture the exception, otherwise throw it
        if (handleOnly) {
            errorHandler.captureException(exception || error);
        }
        else {
            throw exception || error;
        }
    };

    // return the decorator function
    return (target, key, descriptor) => {
        // store original method
        const originalMethod = descriptor.value;

        // check if original methods is async to determine if decorator should be async
        if (originalMethod.constructor.name === 'AsyncFunction') {
            descriptor.value = async function(...args) {
                // try catch the original method passing in args it was called with
                try {
                    return await originalMethod.apply(this, args);
                }
                catch (error) {
                    catchError(error, !!options.handleOnly);
                }
            };
        }
        else {
            descriptor.value = function (...args) {
                // try catch the original method passing in args it was called with
                try {
                    return originalMethod.apply(this, args);
                }
                catch (error) {
                    catchError(error, !!options.handleOnly);
                }
            };
        }

        return descriptor;
    };
}
