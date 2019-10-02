import { Injectable, PipeTransform } from '@nestjs/common';
import { Validator } from 'class-validator';
import { ValidationException } from '../exceptions';

@Injectable()
export class IdentityArrayValidationPipe implements PipeTransform<string[]> {
    async transform(values: string[] = []) {
        const validator = new Validator();
        values.forEach((value) => {
            if (!validator.isUUID(value)) {
                throw new ValidationException('invalid uuid list of identities');
            }
        });
        return values;
    }
}
