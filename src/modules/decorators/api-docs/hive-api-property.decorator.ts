import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { ValidationTypes } from 'class-validator';
import { getValidation } from '../../functions/get-validation.function';

export function HiveApiModelProperty(description: string, metadata: ApiPropertyOptions = {}): PropertyDecorator {
    return (target, propertyKey: string) => {
        const validations = getValidation(target.constructor, propertyKey);

        metadata.required =
            metadata.required !== undefined
                ? metadata.required
                : !validations.includes(ValidationTypes.CONDITIONAL_VALIDATION);

        ApiProperty({
            description,
            ...metadata
        })(target, propertyKey);
    };
}
