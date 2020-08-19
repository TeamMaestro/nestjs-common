import { SortDirection } from '../types';

export interface PaginationOptions {
    page?: number;
    size?: number;
    shift?: number;
    sortByModel?: any;
    sortBy?: string;
    sortDir?: SortDirection;
    filter?: any;
    search?: string;
    user?: any;
}
