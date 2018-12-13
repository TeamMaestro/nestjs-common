import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint()
export class IsNumberConstraint implements ValidatorConstraintInterface {

    validate(number: any) {
        return !isNaN(number);
    }

    defaultMessage(args: ValidationArguments) {
      return `$property must be a number.`;
    }

}

export function IsNumber(validationOptions?: ValidationOptions) {
   // tslint:disable-next-line:ban-types
   return (object: Object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsNumberConstraint
        });
   };
}
