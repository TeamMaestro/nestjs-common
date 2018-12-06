import * as config from 'config';
import * as passport from 'passport';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class VerifySsoGuard implements CanActivate {

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();

        const authErrorMessage = await new Promise<string>((resolve: any) => {
            let verifySso: string;

            try {
                verifySso = config.get<string>('passport.verifySso');
            }
            catch (error) {
                // tslint:disable-next-line:no-console
                console.warn('You need to create a config for passport.verifySso. See the README in @teamhive/nestjs-common');
                verifySso = 'verify-sso';
            }

            passport.authenticate(verifySso, { session: false }, (customError: any, user: any, passportError: any) => {
                if (customError || !user || passportError) {
                    return resolve(customError || passportError.message);
                }

                req.user = user;

                return resolve('NO_ERROR');
            })(req, res, req.next);
        });

        if (authErrorMessage !== 'NO_ERROR') {
            // set authError to check for in controller and return true to allow request through, redirect in controller
            // if guard returns false it will throw an error, setting the headers twice after the redirect
            req.authError = true;
            return true;
        }
        return true;
    }
}
