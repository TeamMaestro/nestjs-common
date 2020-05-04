import { MessagePattern } from '@nestjs/microservices';
import { getMessagePattern } from './get-message-pattern';

export function HiveMessageHandler(messageClass: any): MethodDecorator {
    return (target, property, descriptor) => {
        const messagePattern = getMessagePattern(messageClass);
        MessagePattern(messagePattern)(target, property, descriptor);
    };
}
