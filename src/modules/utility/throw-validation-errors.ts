import { ValidationError } from 'class-validator';
import { ValidationException } from '../exceptions';

export const throwValidationErrors = (errors: ValidationError[], markedCritical = false) => {
    const constraints = errors[0].constraints;
    const children = errors[0].children;
    if (constraints) {
        const message = constraints[Object.keys(constraints)[0]];
        throw new ValidationException(message, { critical: markedCritical });
    } else if (children) {
        throwValidationErrors(children, markedCritical);
    } else {
        throw new ValidationException('Validation Failed', { critical: markedCritical });
    }
};
