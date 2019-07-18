import { TryCatchOptions } from '../interfaces/try-catch-options.interface';
import { TryCatchException } from '../interfaces';
import { TryCatchEmitter } from '../classes';

export function TryCatch(optionsOrException = {} as TryCatchOptions | TryCatchException, options = {} as TryCatchOptions) {
    // set exception based off of type of first param
    let exception: TryCatchException;
    // set options equal to optionsOrException if that param is an object
    const firstParamOptions = optionsOrException as TryCatchOptions;
    if (firstParamOptions.customResponseMessage || firstParamOptions.customResponseMessage || firstParamOptions.handleOnly !== undefined) {
        options = firstParamOptions;
    }
    else {
        exception = optionsOrException as TryCatchException;
    }

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
        // get exception instance if there is an exception passed in
        if (exception) {
            exception = getException(error, exception);
        }

        // wrap the error if wrapper passed
        if (firstParamOptions.errorWrapperClass) {
            error = new firstParamOptions.errorWrapperClass(error);
        }

        // if handler passed in capture the exception, otherwise throw it
        if (handleOnly) {
            // emit for app to subscribe to and handle
            TryCatchEmitter.emit(exception || error);
        }
        else {
            throw exception || error;
        }
    };

    // return the decorator function
    return (_target: any, _key: any, descriptor: any) => {
        // store original method
        const originalMethod = descriptor.value;

        // check if original methods is async to determine if decorator should be async
        if (originalMethod.constructor.name === 'AsyncFunction') {
            descriptor.value = async function(...args: any[]) {
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
            descriptor.value = function(...args: any[]) {
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
