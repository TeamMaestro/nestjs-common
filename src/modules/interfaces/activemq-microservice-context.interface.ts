export interface ActivemqMicroserviceContext {
    rpcType: 'ACTIVE_MQ',
    pattern: string;
    namespace?: string;
}