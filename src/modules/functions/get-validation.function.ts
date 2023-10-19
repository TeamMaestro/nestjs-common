import { getFromContainer, MetadataStorage, ValidationTypes } from 'class-validator';

// tslint:disable-next-line:ban-types
export function getValidation(targetConstructor: Function, propertyKey: string): ValidationTypes[] {
    const validatorStorage: MetadataStorage = getFromContainer(MetadataStorage);

    const targetValidationMetadata = validatorStorage.getTargetValidationMetadatas(targetConstructor, null, null, false);

    const validationMetadata = validatorStorage.groupByPropertyName(targetValidationMetadata);
    if (validationMetadata) {
        const propertyValidation = validationMetadata[propertyKey];
        if (propertyValidation && propertyValidation.length > 0) {
            return propertyValidation.map(validation => validation.type);
        }
    }
    return [];
}
