import { ErrorHandler } from '../services';
import { UnhandledPromiseException, UncaughtException } from '../exceptions';

export class NodeEventHandler {

    logUnhandleRejection() {
        process.on('unhandledRejection', this.logRejection);
    }

    logUncaughtException() {
        process.on('uncaughtException', this.logException);
    }

    handleUnhandledRejection(errorHandler: ErrorHandler) {
        process.removeListener('unhandledRejection', this.logRejection);

        process.on('unhandledRejection', (error: any) => {
            errorHandler.captureException(new UnhandledPromiseException(error));
        });
    }

    handleUncaughtException(errorHandler: ErrorHandler) {
        process.removeListener('uncaughtException', this.logException);

        process.on('uncaughtException', (error: any) => {
            errorHandler.captureException(new UncaughtException(error));
            process.exit(1);
        });
    }

    private logRejection(error: any) {
        // tslint:disable-next-line
        console.error('UNHANDLED REJECTION: ' + error);
    }

    private logException(error: any) {
        // tslint:disable-next-line
        console.error('UNCAUGHT EXCEPTION: ' + error);
        process.exit(1);
    }
}
