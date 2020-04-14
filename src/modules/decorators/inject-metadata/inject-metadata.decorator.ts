import { Body, createParamDecorator, ExecutionContext, Query } from '@nestjs/common';
import { DO_NOT_VALIDATE } from '../../constants';

export const INJECTED_METADATA_KEY = Symbol('INJECTED METADATA KEY');
/**
 * This parameter decorator will pull the given property off of the request and inject the the results of the
 * injectFunctions on to the key [INJECTED_METADATA_KEY].  This constructed object is then the first parameter for when
 * the validation pipe constructs the decorated parameter
 * @param reqProperty property off of the request object (body, query, etc.)
 * @param injectFunctions functions that run at runtime, return data, and are merged into an object that is on the [INJECTED_METADATA_KEY]
 */
export const InjectMetadata = (reqProperty?: string, ...injectFunctions: (
    (req, paramTarget, paramProperty, paramIndex) => object)[]
) => {
    // return the a custom decorator
    return (target, property, index) => {
        if (reqProperty === 'body') {
            Body(DO_NOT_VALIDATE)(target, property, index);
        }
        else if (reqProperty === 'query') {
            Query(DO_NOT_VALIDATE)(target, property, index);
        }
        // create a nest parameter decorator that will have access to the request object
        createParamDecorator((data, ctx: ExecutionContext): any => {
            const req = ctx.switchToHttp().getRequest();
            // if property is not a object, return that value
            if (!reqProperty || typeof req[reqProperty] !== 'object') {
                return req[reqProperty];
            }

            // inject request and parameter data into the inject functions and merge their results
            const reqValue = req[reqProperty];
            const [paramTarget, paramProperty, paramIndex] = data;
            let injectedMetadata = {};
            injectFunctions.forEach((fn) => {
                injectedMetadata = Object.assign(injectedMetadata, fn(ctx, paramTarget, paramProperty, paramIndex));
            });
            return {
                ...reqValue,
                [INJECTED_METADATA_KEY]: injectedMetadata
            };
        })
            // pass the decorator information into the data parameter of the nest parameter decorator
            ([target, property, index])
            // call the parameter decorator based on the information received from the custom decorator
            (target, property, index);
    };
};
