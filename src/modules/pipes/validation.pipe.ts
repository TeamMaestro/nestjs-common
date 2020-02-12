import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { DO_NOT_VALIDATE } from '../constants';
import { throwValidationErrors } from '../utility';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {

    async transform(value, metadata: ArgumentMetadata) {
        const { metatype, data } = metadata;
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        // if the parameter is an injected metadata parameter
        if (data === DO_NOT_VALIDATE) {
            return value;
        }
        // Construct the class with the value
        const object = new metatype(value);
        const errors = await validate(object);
        if (errors.length > 0) {
            throwValidationErrors(errors);
        }

        // We will return the constructed class
        return object;
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find((type) => metatype === type);
    }
}
