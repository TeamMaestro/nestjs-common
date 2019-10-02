import { INJECTED_METADATA_KEY } from './inject-metadata.decorator';

export interface InjectedMetadata<InjectableMetadata, PickProperties extends keyof InjectableMetadata> {
    [INJECTED_METADATA_KEY]: Pick<InjectableMetadata, PickProperties>;
}
