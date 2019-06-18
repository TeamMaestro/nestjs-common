import * as config from 'config';
import * as redis from 'redis';
import * as EventEmitter from 'events';
import { ApplicationTokens } from '../../application-tokens.const';

export class RedisClient extends EventEmitter {
    connection: redis.RedisClient;

    private redisConfig: any;
    private pingRate: number;
    private maxTotalRetryTime: number;

    constructor() {
        super();

        this.pingRate = 60000; // in ms
        this.maxTotalRetryTime = 10000; // in ms

        // setup config
        try {
            this.redisConfig = config.get<object>('redis');
        }
        catch (error) {
            // tslint:disable-next-line:no-console
            console.warn('You need to create a config for redis. See the README in @teamhive/nestjs-common');
            this.redisConfig = {
                host: 'localhost',
                keyPrefix: 'app_',
                expiration: 86400000
            };
        }

        // create the intial client connection
        this.connection = this.setupClient();
        // start pinging redis
        this.pingRedis();
    }

    /**
     * 1. Create the new client
     * 2. Set the retry_startegy to destroy this connection and create a new one if
     *    can't connect for 10 seconds
     * 3. Subscribe and emit the new connection's events
     * 4. Return the client
     */
    setupClient() {
        // initial connection
        const self = this;
        const client = redis.createClient({
            retry_strategy(options: any) {
                if (options.totalRetryTime > self.maxTotalRetryTime) {
                    self.emit('error', new Error('Retry time exhausted, creating new client connection...'));

                    // cleanly end connection, then setup new client connection
                    client.quit();
                    self.connection = self.setupClient();
                    return;
                }

                // gradually increase time between connection attempts
                return Math.min(options.attempt * 100, 3000);
            },

            // default enable_offline_queue to false so that any requests made while client
            // is trying to reconnect are immeditelly sent an error, instead of waiting for
            // reconnect and holding up the response to the end user
            enable_offline_queue: false,
            ...this.redisConfig
        });

        this.emitClientEvents(client);

        return client;
    }

    /**
     * Has the instance of this class listen to and emit the client events.
     * This way the application using this RedisClient only has to subscribe to this
     * classes events, instead of resubscribing to every new connection created.
     * @param client
     */
    private emitClientEvents(client: redis.RedisClient) {
        client.on('error', (error) => this.emit('error', error));
        client.on('ready', () => this.emit('ready'));
        client.on('reconnecting', () => this.emit('reconnecting'));
        client.on('end', () => this.emit('end'));
    }

    /**
     * Ping redis once every minute to keep the connection from idling
     */
    private pingRedis() {
        setInterval(() => {
            if (this.connection && this.connection.ping) {
                this.connection.ping();
            }
        }, this.pingRate);
    }
}

export const RedisProvider = {
    provide: ApplicationTokens.RedisClientToken,
    useValue: new RedisClient()
};
