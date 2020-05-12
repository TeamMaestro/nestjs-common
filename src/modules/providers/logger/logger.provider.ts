import * as log from 'log4js';
import { ApplicationTokens } from '../../application-tokens.const';

export const LoggerProvider = {
    provide: ApplicationTokens.LoggerToken,
    useFactory: () => {
        const logger = log.getLogger();
        return logger;
    },
};
