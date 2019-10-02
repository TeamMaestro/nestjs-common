import { InjectedMetadata } from './injected-metadata.interface';

export type InjectedDto<DtoType, InjectableMetadata, PickedFields extends keyof InjectableMetadata> = DtoType & InjectedMetadata<InjectableMetadata, PickedFields>;
