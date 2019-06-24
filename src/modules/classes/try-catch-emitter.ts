import { EventEmitter } from 'events';

export class TryCatchEmitter {
    private static emitter = new EventEmitter();

    private constructor() {}

    /**
     * Pass error to be emitted to listeners
     * @param error
     */
    static emit(error: any) {
        this.emitter.emit('error', error);
    }

    /**
     * Pass custom error handling function to be run when the
     * TryCatch emits an error
     * @param cb
     */
    static listen(cb: (error: any) => void) {
        this.emitter.on('error', (e) => cb(e));
    }
}
