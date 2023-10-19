import { DynamicModule, Module } from '@nestjs/common';
import { RedisProvider } from '../providers';
import { getRedisConfigurationProvider } from '../providers';
import { RedisService } from '../services';
import { RedisClientOptions } from '@redis/client';

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
    static register(optionsFactory?: () => RedisClientOptions): DynamicModule {
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
