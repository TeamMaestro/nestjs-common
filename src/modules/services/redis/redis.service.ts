import { Inject, Injectable } from '@nestjs/common';
import * as redis from 'redis';
import { ApplicationTokens } from '../../application-tokens.const';
import { RedisException } from '../../exceptions/redis.exception';
import { ErrorHandler } from '../error-handler';

@Injectable()
export class RedisService {
    constructor(
        @Inject(ApplicationTokens.RedisClientToken)
        private readonly client: redis.RedisClient,

        @Inject()
        private readonly logger: ErrorHandler
    ) {
        // tslint:disable
        this.client.on('error', (err) => this.logger.captureException(err));
        this.client.on('ready', () => this.logger.captureMessage('Connected to Redis'));
        this.client.on('reconnecting', () => this.logger.captureMessage('Attempting to reconnect to Redis...'));
        this.client.on('end', () => this.logger.captureException(new RedisException(new Error('Redis Connection Fatal'))))
        // tslint:enable
    }

    getValue(key: string) {
        return new Promise<any>((resolve, reject) => {
            this.client.get(key, async (error, response) => {
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
                this.client.set(key, JSON.stringify(value), 'EX', duration, (err, response) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(response);
                });
            }
            else {
                this.client.set(key, JSON.stringify(value), (err, response) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(response);
                });
            }
        });
    }

    async delete(key: string) {
        try {
            await this.client.del(key);
        }
        catch (error) {
            throw new RedisException(error);
        }
    }
}
