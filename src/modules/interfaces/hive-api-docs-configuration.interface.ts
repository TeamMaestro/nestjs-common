export interface HiveApiDocConfig {
    summary: string;
    description: string;
    deprecated?: boolean;
    response: {
        status: number,
        type?: any
    };
}
