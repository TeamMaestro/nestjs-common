import { SequelizeError } from '../interfaces';

export class SqlExceptionError extends Error implements SequelizeError {
    message: string;
    stack: string;
    original: any;
    parent: any;
    sql: string;

    constructor(error: SequelizeError) {
        super();

        if (error) {
            this.message = error.message;
            this.stack = error.stack;
            this.original = error.original;
        }

        /**
         * Set these properties to undefined to reduce size of object sent to Sentry.
         * Parent is just a copy of original and sql is already included on original.
         */
        this.parent = undefined;
        this.sql = undefined;
    }
}
