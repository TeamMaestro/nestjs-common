import { createParamDecorator } from '@nestjs/common';

export const QueryUser = createParamDecorator((_data, req): any => {
    return {
        user: req.user || {},
        ...req.query
    };
});
