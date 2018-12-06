import * as config from 'config';
import * as passport from 'passport';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '../exceptions';

@Injectable()
export class IsLoggedInGuard implements CanActivate {

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();

        const authErrorMessage = await new Promise<string>((resolve: any) => {
            let verifyUser: string;

            try {
                verifyUser = config.get<string>('passport.verifyUser');
            }
            catch (error) {
                // tslint:disable-next-line:no-console
                console.warn('You need to create a config for passport.verifyUser. See the README in @teamhive/nestjs-common');
                verifyUser = 'verify-user';
            }

            passport.authenticate(verifyUser, { session: false }, (customError: any, user: any, passportError: any) => {
                if (customError || !user || passportError) {
                    return resolve(customError || passportError.message);
                }

                req.user = user;

                return resolve();
            })(req, res, req.next);
        });

        if (authErrorMessage) {
            throw new UnauthorizedException(authErrorMessage);
        }
        return true;
    }
}
