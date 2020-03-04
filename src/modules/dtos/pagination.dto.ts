import { IsIn, IsOptional, IsString } from 'class-validator';
import { HiveApiModelProperty } from '../decorators';
import { PaginationOptions } from '../interfaces';
import { SortDirection } from '../types';
import { IsNumber } from '../validators';

export class Pagination {
    @HiveApiModelProperty(`The number of page to fetch`)
    @IsNumber()
    @IsOptional()
    page: number;

    @HiveApiModelProperty(`The number of results to fetch`)
    @IsNumber()
    @IsOptional()
    size: number;

    @HiveApiModelProperty(`Property to sort by`)
    @IsString()
    @IsOptional()
    sortBy: string;

    @HiveApiModelProperty(`sort direction: ASC, DESC`)
    @IsString()
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortDir: SortDirection;

    offset: number;
    sortByModel: any;
    defaultSort: string;

    constructor(defaultSortBy: string, options: PaginationOptions) {
        this.defaultSort = defaultSortBy;

        options.page = (options.page === undefined) ? 0 : +options.page;
        options.size = (options.size === undefined) ? 10 : +options.size;

        // If size or page is -1, then leave these undefined
        if (Number(options.size) !== -1 && Number(options.page) !== -1) {
            this.page = options.page;
            this.size = options.size;
            this.offset = this.page * this.size;
        }
        this.sortBy = options.sortBy || defaultSortBy;
        this.sortDir = options.sortDir || 'DESC';
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
            const sortByKey = options.sortBy || 'id';
            sortBy.push([sortByKey, 'asc']);
        }

        return sortBy;
    }
}

interface OrderBy {
    sortById?: boolean;
    sortBy?: string;
}
