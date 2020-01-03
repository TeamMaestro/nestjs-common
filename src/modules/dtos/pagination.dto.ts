import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationOptions, SortDirection } from '../interfaces';
import { IsNumber } from '../validators';

export class Pagination {
    @IsNumber()
    @IsOptional()
    page: number;

    @IsNumber()
    @IsOptional()
    size: number;

    offset: number;

    sortByModel: any;

    @IsString()
    @IsOptional()
    sortBy: string;

    @IsString()
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortDir: SortDirection;

    @IsString()
    @IsOptional()
    defaultSort: string;

    @IsOptional()
    search: any;

    constructor(defaultSortBy: string, options: PaginationOptions) {
        this.defaultSort = defaultSortBy;

        this.page = +options.page || 0;
        this.size = +options.size || 10;
        this.sortBy = options.sortBy || defaultSortBy;
        this.sortDir = options.sortDir || 'DESC';

        this.offset = this.page * this.size;
    }

    getOrderBy(options = {} as OrderBy) {
        const sortBy = [];

        if (this.sortByModel) {
            sortBy.push([this.sortByModel, this.sortBy, this.sortDir]);
        }
        else {
            sortBy.push([this.sortBy, this.sortDir]);
        }

        if (options.sortById !== false) {
            sortBy.push(['id', 'asc']);
        }

        return sortBy;
    }
}

interface OrderBy {
    sortById: boolean;
}
