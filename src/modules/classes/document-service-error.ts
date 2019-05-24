export class DocumentServiceExceptionError extends Error {
    message: string;
    stack: string;
    original: any;

    constructor(error: any) {
        super();

        if (error) {
            this.message = error.message;
            this.stack = error.stack;
            this.original = error.original;
        }
    }
}
