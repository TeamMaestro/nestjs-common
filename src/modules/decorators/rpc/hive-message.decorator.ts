export const RPC_PATTERN_KEY = 'loop:rpc-pattern-key';

export function HiveMessage(messagePattern: string): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(RPC_PATTERN_KEY, messagePattern, target);
    };
}
