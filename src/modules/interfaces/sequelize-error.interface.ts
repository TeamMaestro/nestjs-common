export interface SequelizeError {
    name: string;
    message: string;
    stack: string;
    original: any;
    parent: any;
    sql: string;
}
