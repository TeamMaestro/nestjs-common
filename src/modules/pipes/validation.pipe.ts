import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { ValidationException } from '../exceptions';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {

    async transform(value, metadata: ArgumentMetadata) {
        const { metatype } = metadata;
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        // Construct the class with the value
        const object = new metatype(value);
        const errors = await validate(object);
        if (errors.length > 0) {
            this.getError(errors);
        }

        // We will return the constructed class
        return object;
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find((type) => metatype === type);
    }

    private getError(errors: ValidationError[]) {
        const constraints = errors[0].constraints;
        const children = errors[0].children;
        if (constraints) {
            const message = constraints[Object.keys(constraints)[0]];
            throw new ValidationException(message);
        }
        else if (children) {
            this.getError(children);
        }
        else {
            throw new ValidationException('Validation Failed');
        }
    }
}
