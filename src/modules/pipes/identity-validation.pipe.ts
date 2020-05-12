import { Injectable, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { ValidationException } from '../exceptions';

@Injectable()
export class IdentityValidationPipe implements PipeTransform<string> {
    async transform(value: string) {
        if (!isUUID(value)) {
            throw new ValidationException('invalid uuid in url param');
        }
        return value;
    }
}
