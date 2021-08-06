import { ArgumentsHost, ContextType, HttpStatus, Injectable } from '@nestjs/common';
import * as express from 'express';
import { EMPTY, throwError } from 'rxjs';
import { ActivemqMicroserviceContext } from '../interfaces/activemq-microservice-context.interface';
import { ErrorHandler } from '../services/error-handler/error-handler.service';

@Injectable()
export class BaseHttpExceptionFilter {
    constructor(
        protected readonly errorHandler: ErrorHandler
    ) {
    }

    getInitialException(exception: any) {
        // use 405 instead of 403 do to cloud front's handling of forbidden
        if (exception.status === HttpStatus.FORBIDDEN) {
            exception.status = HttpStatus.METHOD_NOT_ALLOWED;
        }
        return exception;
    }

    /**
     * check for fields on response specific to http to determine context type
     * @param host
     */
    getHostContextType(host: ArgumentsHost): ContextType {
        const res: express.Response = host.switchToHttp().getResponse();
        if (res.req && res.status && typeof res.status === 'function') {
            return 'http';
        }
        return 'rpc';
    }

    handleRpcException(exception: any, host: ArgumentsHost, logException: boolean) {
        const context = host.switchToRpc().getContext<ActivemqMicroserviceContext>();

        if (context.rpcType === 'ACTIVE_MQ') {
            if (logException) {
                this.errorHandler.captureException(exception);
            }

            return throwError(exception);
        } else {
            return EMPTY;
        }
    }
}
