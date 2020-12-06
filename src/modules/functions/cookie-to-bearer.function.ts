import * as express from 'express';

export function CookieToBearer(cookieName: string = 'access_token') {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {

        if (req.cookies && req.cookies[cookieName]) {
            req.headers['authorization'] = `bearer ${req.cookies[cookieName]}`;
        }
        next();
    };
}
