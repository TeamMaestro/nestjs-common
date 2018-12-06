import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((_data, req) => {
    return req.user || {};
});
