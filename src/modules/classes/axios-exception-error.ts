import { AxiosError } from 'axios';

export class AxiosExceptionError extends Error {
    message: string;
    stack: string;
    original: any;

    constructor(error: AxiosError) {
        super();

        if (error) {
            if (error.response) {
                this.message = `${error.response.status} - ${error.response.statusText}`;
                this.original = {
                    config: error.config,
                    response: {
                        status: error.response.status,
                        statusText: error.response.statusText,
                        headers: error.response.headers
                    }
                };
            }
            else {
                this.message = error.message;
            }

            this.stack = error.stack;
        }
    }
}
