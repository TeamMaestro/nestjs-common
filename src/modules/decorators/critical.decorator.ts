import { SetMetadata } from '@nestjs/common';

export const Critical = (critical: boolean) => SetMetadata('markedCritical', critical);
