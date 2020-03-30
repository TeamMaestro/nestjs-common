import { Global, Module } from '@nestjs/common';
import { FilterProviders } from '../providers';

@Global()
@Module({
    providers: [
        ...FilterProviders
    ]
})
export class FilterModule {}
