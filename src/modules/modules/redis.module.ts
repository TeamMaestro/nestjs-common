import { DynamicModule, Module } from '@nestjs/common';
import { ClientOpts } from 'redis';
import { RedisProvider } from '../providers';
import { getRedisConfigurationProvider } from '../providers/redis-configuration/redis-configuration.provider';
import { RedisService } from '../services';

@Module({
    providers: [
        RedisProvider,
        RedisService,
        getRedisConfigurationProvider()
    ],
    exports: [
        RedisService
    ]
})
export class RedisModule {
    static register(optionsFactory?: () => ClientOpts): DynamicModule {
        return {
            module: RedisModule,
            providers: [
                RedisProvider,
                RedisService,
                getRedisConfigurationProvider(optionsFactory)
            ],
            exports: [
                RedisService
            ]
        };
    }
}