export interface TryCatchOptions {
    handleOnly?: boolean;
    customResponseMessage?: string;
    errorWrapperClass?: { new (param1: Error) };
}
