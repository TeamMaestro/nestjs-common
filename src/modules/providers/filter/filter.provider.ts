import { ClassProvider } from '@nestjs/common/interfaces';
import { APP_FILTER } from '@nestjs/core';
import { LoggedHttpExceptionFilter, PassiveHttpExceptionFilter, RedirectHttpExceptionFilter, UncaughtExceptionFilter } from '../../filters';

export const FilterProviders: ClassProvider[] = [
    {
        provide: APP_FILTER,
        useClass: UncaughtExceptionFilter
    },
    {
        provide: APP_FILTER,
        useClass: PassiveHttpExceptionFilter
    },
    {
        provide: APP_FILTER,
        useClass: RedirectHttpExceptionFilter
    },
    {
        provide: APP_FILTER,
        useClass: LoggedHttpExceptionFilter
    }
];
