import { Injectable, PipeTransform } from '@nestjs/common';
import { isArray, isUUID } from 'class-validator';
import { ValidationException } from '../exceptions';

@Injectable()
export class IdentityArrayValidationPipe implements PipeTransform<string[]> {
    async transform(values: string[] = []) {
        if (!values) {
            throw new ValidationException('array of identities is not defined');
        }
        if (!isArray(values)) {
            throw new ValidationException('invalid array');
        }
        values.forEach((value) => {
            if (!isUUID(value)) {
                throw new ValidationException('invalid uuid list of identities');
            }
        });
        return values;
    }
}
