import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '../exceptions';
import { PassportWhitelistedErrors } from '../enums';

export function PassportAuthGuard(strategyToken: string) {
    return class Guard extends AuthGuard(strategyToken) {
        whitelistedErrors: Set<string>;

        constructor() {
            super();

            this.whitelistedErrors = new Set(Object.values(PassportWhitelistedErrors));
        }

        handleRequest(error, user, passportError) {
            if (error || !user) {
                // if the error is not an instance of our UnauthorizedException, then capture
                if (!(error instanceof UnauthorizedException)) {
                    const actualError = error ||
                        (passportError instanceof Error) ? passportError : false ||
                        new Error('Passport Error');

                    // only handle (report to sentry) if not a whitelisted error
                    if (!this.isWhitelisted(actualError)) {
                        this.handleErrors(actualError);
                    }
                }

                throw new UnauthorizedException();
            }

            return user;
        }

        isWhitelisted(error = {} as Error) {
            return Array.from(this.whitelistedErrors).some(whitelistedError => {
                if (typeof error.message === 'string') {
                    return error.message.includes(whitelistedError);
                }
                return false;
            });
        }

        handleErrors(error: Error) {
            console.warn('Override the handleErrors method in the child class of PassportAuthGuard to report errors!');
            console.error(error);
        }

        addToWhitelist(messages: string[]) {
            messages.forEach(message => this.whitelistedErrors.add(message));
        }

        removeFromWhitelist(messages: PassportWhitelistedErrors[]) {
            messages.forEach(message => this.whitelistedErrors.delete(String(message)));
        }
    };
}
