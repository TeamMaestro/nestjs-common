import { RPC_PATTERN_KEY } from './hive-message.decorator';

export function getMessagePattern(target: any) {
    return Reflect.getMetadata(RPC_PATTERN_KEY, target);
}
