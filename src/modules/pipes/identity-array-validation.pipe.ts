import { Injectable, PipeTransform } from '@nestjs/common';
import { Validator } from 'class-validator';
import { ValidationException } from '../exceptions';

@Injectable()
export class IdentityArrayValidationPipe implements PipeTransform<string[]> {
    async transform(values: string[] = []) {
        if (!values) {
            throw new ValidationException('array of identities is not defined');
        }
        const validator = new Validator();
        if (!validator.isArray(values)) {
            throw new ValidationException('invalid array');
        }
        values.forEach((value) => {
            if (!validator.isUUID(value)) {
                throw new ValidationException('invalid uuid list of identities');
            }
        });
        return values;
    }
}
