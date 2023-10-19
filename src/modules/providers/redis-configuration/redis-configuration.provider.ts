import { FactoryProvider } from '@nestjs/common';
import { RedisClientOptions } from '@redis/client';
export const RedisConfigurationToken = 'teamhive:nestjs:RedisConfigurationToken';

export type RedisConfigurationOptions = RedisClientOptions & {expiration?: number; keyPrefix?: string};

export function getRedisConfigurationProvider(optionsFactory: () => RedisConfigurationOptions = () => ({
    socket: { host: 'localhost' }
})): FactoryProvider {
    return {
        provide: RedisConfigurationToken,
        useFactory: optionsFactory
    };
}
