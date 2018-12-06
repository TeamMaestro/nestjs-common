import { TryCatchException } from '../interfaces/try-catch-exception.interface';
import { TryCatchOptions } from '../interfaces/try-catch-options.interface';

export function TryCatch(Exception: TryCatchException, options = {} as TryCatchOptions) {

    // helper function to pass appropriate arguments to exception
    const throwCorrectExceptionStyle = (error) => {
        if (new Exception(error).error) {
            if (options.customResponseMessage) {
                throw new Exception(error, options.customResponseMessage);
            }
            throw new Exception(error);
        }

        if (options.customResponseMessage) {
            throw new Exception(options.customResponseMessage);
        }
        throw new Exception();
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
                    throwCorrectExceptionStyle(error);
                }
            };
        }
        else {
            descriptor.value = function(...args) {
                // try catch the original method passing in args it was called with
                try {
                    return originalMethod.apply(this, args);
                }
                catch (error) {
                    throwCorrectExceptionStyle(error);
                }
            };
        }

        return descriptor;
    };
}
