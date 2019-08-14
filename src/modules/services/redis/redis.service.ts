import { Inject, Injectable } from '@nestjs/common';
import { ApplicationTokens } from '../../application-tokens.const';
import { RedisException } from '../../exceptions/redis.exception';
import { RedisClient } from '../../providers';
import { ErrorHandler } from '../error-handler';

@Injectable()
export class RedisService {
    constructor(
        @Inject(ApplicationTokens.RedisClientToken)
        private readonly client: RedisClient,

        private readonly errorHandler: ErrorHandler
    ) {
        // tslint:disable
        this.client.on('error', (error) => this.errorHandler.captureException(new RedisException(error)));
        this.client.on('ready', () => this.errorHandler.captureBreadcrumb({ message: 'Connected to Redis' }));
        this.client.on('reconnecting', () => this.errorHandler.captureBreadcrumb({ message: 'Attempting to reconnect to Redis...' }));
        this.client.on('end', () => this.errorHandler.captureException(new RedisException(new Error('Redis Connection Fatal'))))
        // tslint:enable
    }

    getValue(key: string) {
        return new Promise<any>((resolve, reject) => {
            this.client.connection.get(key, async (error, response) => {
                if (error) {
                    return reject(error);
                }

                let parsedResponse;
                try {
                    parsedResponse = JSON.parse(response);
                }
                catch (error) {
                    reject(error);
                }

                return resolve(parsedResponse);
            });
        });
    }

    setValue(key: string, value: any, duration?: number) {
        return new Promise<any>((resolve, reject) => {
            if (duration) {
                this.client.connection.set(key, JSON.stringify(value), 'EX', duration, (err, response) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(response);
                });
            }
            else {
                this.client.connection.set(key, JSON.stringify(value), (err, response) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(response);
                });
            }
        });
    }

    async delete(key: string | string[]) {
        try {
            await this.client.connection.del(key);
        }
        catch (error) {
            throw new RedisException(error);
        }
    }
}
