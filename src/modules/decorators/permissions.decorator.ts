import { ReflectMetadata } from '@nestjs/common';

export const Permissions = <T>(...permissions: T[]) => ReflectMetadata('permissions', permissions);
