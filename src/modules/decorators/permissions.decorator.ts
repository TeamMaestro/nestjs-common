import { SetMetadata } from '@nestjs/common';

export const Permissions = <T>(...permissions: T[]) => SetMetadata('permissions', permissions);
