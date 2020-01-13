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
