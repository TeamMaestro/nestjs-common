export interface HiveApiDocConfig {
    summary: string;
    description: string;
    deprecated?: boolean;
    response: {
        status: number,
        type?: any
    };
    headers?: {
        name: string;
        description: string;
    }[];
}
