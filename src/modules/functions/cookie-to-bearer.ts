import * as config from 'config';
import * as express from 'express';

export function CookieToBearer(req: express.Request, res: express.Response, next: express.NextFunction) {
    let cookieName: string;
    try {
        cookieName = config.get<string>('session.accessCookie.name');
    }
    catch (error) {
        // tslint:disable-next-line:no-console
        console.warn('You need to create a config for session.accessCookie.name. See the README in @teamhive/nestjs-common');
        cookieName = 'access_token';
    }

    if (req.cookies && req.cookies[cookieName]) {
        req.headers['authorization'] = `bearer ${req.cookies[cookieName]}`;
    }
    next();
}
