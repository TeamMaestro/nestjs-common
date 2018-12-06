import * as log from 'log4js';
import * as config from 'config';
import { ApplicationTokens } from '../../application-tokens.const';

export const LoggerProvider = {
    provide: ApplicationTokens.LoggerToken,
    useFactory: async () => {
        let level: string;
        try {
            level = config.get('logger.level');
        }
        catch (error) {
            // tslint:disable-next-line:no-console
            console.warn('You need to create a config for logger.level. See the README in @teamhive/nestjs-common');
            level = 'debug';
        }
        const logger = log.getLogger();
        logger.level =  level;

        return logger;
    },
};
