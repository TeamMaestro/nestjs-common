import { FactoryProvider } from '@nestjs/common';
import { StaticErrorHandlerConfiguration } from '@teamhive/node-common';

export type ErrorHandlerConfigurationOptions = StaticErrorHandlerConfiguration;
export const ErrorHandlerConfigurationToken = 'teamhive:nestjs:ErrorHandlerConfigurationToken';

export function getErrorHandlerConfigurationProvider(optionsFactory: () => ErrorHandlerConfigurationOptions = () => ({
    sanitizeException: true,
    sanitizeStack: {
        enabled: true,
        length: 10000
    }
})): FactoryProvider {
    return {
        provide: ErrorHandlerConfigurationToken,
        useFactory: optionsFactory
    };
}