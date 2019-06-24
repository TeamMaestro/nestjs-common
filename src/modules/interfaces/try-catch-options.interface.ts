import { TryCatchException } from './try-catch-exception.interface';

export interface TryCatchOptions {
    exception?: TryCatchException;
    handleOnly?: boolean;
    customResponseMessage?: string;
}
