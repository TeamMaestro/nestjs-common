import * as config from 'config';
import * as redis from 'redis';
import * as bluebird from 'bluebird';
import { ApplicationTokens } from '../../application-tokens.const';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let redisConfig: any;
try {
    redisConfig = config.get<object>('redis');
}
catch (error) {
    // tslint:disable-next-line:no-console
    console.warn('You need to create a config for redis. See the README in @teamhive/nestjs-common');
    redisConfig = {
        host: 'localhost',
        keyPrefix: 'app_',
        expiration: 86400000
    };
}

const client = bluebird.promisifyAll(redis.createClient(redisConfig)) as redis.RedisClient;

export const RedisProvider = {
    provide: ApplicationTokens.RedisClientToken,
    useValue: client
};
