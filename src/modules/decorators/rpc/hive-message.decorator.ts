import { Critical } from '../critical.decorator';

export const RPC_PATTERN_KEY = 'loop:rpc-pattern-key';
export const RPC_OPTIONS_KEY = 'teamhive:rpc-message-options';

export interface HiveMessageOptions {
    isRpc?: boolean;
}

export function HiveMessage(messagePattern: string, options: HiveMessageOptions = {}): ClassDecorator {
    return (target) => {
        Critical()(target);
        Reflect.defineMetadata(RPC_PATTERN_KEY, messagePattern, target);
        Reflect.defineMetadata(RPC_OPTIONS_KEY, options, target);
    };
}
