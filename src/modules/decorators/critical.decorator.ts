import { SetMetadata } from '@nestjs/common';

export const Critical = (critical: boolean = true) => SetMetadata('markedCritical', critical);
