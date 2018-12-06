import { SortDirection } from './sort-direction.types';

export interface PaginationOptions {
    page?: number;
    size?: number;
    sortByModel?: any;
    sortBy?: string;
    sortDir?: SortDirection;
    filter?: any;
    search?: string;
    user?: any;
}
