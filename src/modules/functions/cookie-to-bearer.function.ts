import { getConfig } from '@teamhive/node-common';
import * as express from 'express';

export function CookieToBearer(req: express.Request, res: express.Response, next: express.NextFunction) {
    let cookieName: string;
    try {
        cookieName = getConfig<string>('authentication.session.accessCookie.name');
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.warn(
            'You need to create a config for authentication.session.accessCookie.name. See the README in @teamhive/nestjs-common'
        );
        cookieName = 'access_token';
    }

    if (req.cookies && req.cookies[cookieName]) {
        req.headers['authorization'] = `bearer ${req.cookies[cookieName]}`;
    }
    next();
}
