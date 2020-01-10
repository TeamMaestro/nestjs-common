import { SortDirection } from '../enums/sort-direction.enum';

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
