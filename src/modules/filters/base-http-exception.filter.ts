export class BaseHttpExceptionFilter {
    getInitialException(exception: any) {
        let initialException = exception;
        while (true) {
            if (initialException.error &&
                initialException.error.status &&
                initialException.error.message
            ) {
                initialException = initialException.error;
            }
            else {
                break;
            }
        }

        return initialException;
    }
}
