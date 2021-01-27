import { Inject, Injectable } from '@nestjs/common';
import { ApplicationTokens } from '../../application-tokens.const';
import { RedisException } from '../../exceptions/redis.exception';
import { RedisClient } from '../../providers';
import { RedisConfigurationOptions, RedisConfigurationToken } from '../../providers/redis-configuration/redis-configuration.provider';
import { ErrorHandler } from '../error-handler';

@Injectable()
export class RedisService {
    private keyPrefix: string;
    private defaultExpiration: number;

    constructor(
        @Inject(ApplicationTokens.RedisClientToken)
        public readonly client: RedisClient,
        @Inject(RedisConfigurationToken)
        private readonly redisConfiguration: RedisConfigurationOptions,

        private readonly errorHandler: ErrorHandler
    ) {
        // tslint:disable
        this.client.on('error', error => this.errorHandler.captureException(new RedisException(error)));
        this.client.on('ready', () => this.errorHandler.captureBreadcrumb({ message: 'Connected to Redis' }));
        this.client.on('reconnecting', () =>
            this.errorHandler.captureBreadcrumb({ message: 'Attempting to reconnect to Redis...' })
        );
        this.client.on('end', () =>
            this.errorHandler.captureException(new RedisException(new Error('Redis Connection Fatal')))
        );
        // tslint:enable

        this.defaultExpiration = this.redisConfiguration.expiration ?? 86400;
        this.keyPrefix = this.redisConfiguration.keyPrefix ?? '';
    }

    getValue(key: string, ignorePrefix?: boolean) {
        return new Promise<any>((resolve, reject) => {
            this.client.connection.get(`${ignorePrefix ? '' : this.keyPrefix}${key}`, async (error, response) => {
                if (error) {
                    return reject(error);
                }

                let parsedResponse;
                try {
                    parsedResponse = JSON.parse(response);
                } catch (error) {
                    reject(error);
                }

                return resolve(parsedResponse);
            });
        });
    }

    setValue(key: string, value: any, duration: number = this.defaultExpiration, ignorePrefix?: boolean) {
        return new Promise<any>((resolve, reject) => {
            if (duration > 0) {
                this.client.connection.set(
                    `${ignorePrefix ? '' : this.keyPrefix}${key}`,
                    JSON.stringify(value),
                    'EX',
                    duration,
                    (err, response) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(response);
                    }
                );
            } else {
                this.client.connection.set(`${this.keyPrefix}${key}`, JSON.stringify(value), (err, response) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(response);
                });
            }
        });
    }

    async delete(key: string | string[], ignorePrefix?: boolean) {
        if (Array.isArray(key)) {
            key = key.map(individualKey => ignorePrefix ? '' : this.keyPrefix + individualKey);
        } else {
            key = `${this.keyPrefix}${key}`;
        }
        try {
            await this.client.connection.del(key);
        } catch (error) {
            throw new RedisException(error);
        }
    }

    async getKeys(pattern: string, ignorePrefix?: boolean) {
        return new Promise<string[]>((resolve, reject) => {
            this.client.connection.keys(`${ignorePrefix ? '' : this.keyPrefix}${pattern}`, (err, keys) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(keys)
                }
            })
        })
    }
}
