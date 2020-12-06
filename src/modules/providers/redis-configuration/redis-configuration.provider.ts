import { FactoryProvider } from '@nestjs/common';
import { ClientOpts } from 'redis';
export const RedisConfigurationToken = 'teamhive:nestjs:RedisConfigurationToken';

export type RedisConfigurationOptions = ClientOpts & {expiration?: number; keyPrefix?: string};

export function getRedisConfigurationProvider(optionsFactory: () => RedisConfigurationOptions = () => ({
    host: 'localhost'
})): FactoryProvider {
    return {
        provide: RedisConfigurationToken,
        useFactory: optionsFactory
    };
}