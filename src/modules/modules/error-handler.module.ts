import { DynamicModule, Module } from '@nestjs/common';
import { ErrorHandlerConfigurationOptions, getErrorHandlerConfigurationProvider } from '../providers';
import { ErrorHandler } from '../services';

@Module({
    providers: [
        ErrorHandler,
        getErrorHandlerConfigurationProvider()
    ],
    exports: [
        ErrorHandler
    ]
})
export class ErrorHandlerModule {
    static register(optionsFactory?: () => ErrorHandlerConfigurationOptions): DynamicModule {
        return {
            module: ErrorHandlerModule,
            providers: [
                ErrorHandler,
                getErrorHandlerConfigurationProvider(optionsFactory)
            ],
            exports: [ErrorHandler]
        };
    }
}