import { FactoryProvider } from '@nestjs/common';
import { StaticErrorHandlerConfiguration } from '@gtindependence/node-common';

export type ErrorHandlerConfigurationOptions = StaticErrorHandlerConfiguration;
export const ErrorHandlerConfigurationToken = 'teamhive:nestjs:ErrorHandlerConfigurationToken';

export function getErrorHandlerConfigurationProvider(
    optionsFactory: () => ErrorHandlerConfigurationOptions = () => ({
        useSentry: true
    })
): FactoryProvider {
    return {
        provide: ErrorHandlerConfigurationToken,
        useFactory: optionsFactory
    };
}
