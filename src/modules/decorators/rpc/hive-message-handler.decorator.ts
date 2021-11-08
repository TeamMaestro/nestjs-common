import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { getMessageOptions } from './get-message-options';
import { getMessagePattern } from './get-message-pattern';

export function HiveMessageHandler(messageClass: any): MethodDecorator {
    return (target, property, descriptor) => {
        const messagePattern = getMessagePattern(messageClass);
        const messageOptions = getMessageOptions(messageClass);
        if (messageOptions.isRpc) {
            MessagePattern(messagePattern)(target, property, descriptor);
        } else {
            EventPattern(messagePattern)(target, property, descriptor);
        }
    };
}
