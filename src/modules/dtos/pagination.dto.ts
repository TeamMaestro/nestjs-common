import { IsIn, IsOptional, IsString } from 'class-validator';
import { HiveApiModelProperty } from '../decorators';
import { SortDirection } from '../enums/sort-direction.enum';
import { PaginationOptions } from '../interfaces';
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

    @HiveApiModelProperty(`sort direction: ${Object.values(SortDirection)}`)
    @IsString()
    @IsOptional()
    @IsIn(Object.values(SortDirection))
    sortDir: SortDirection;

    offset: number;
    sortByModel: any;
    defaultSort: string;

    constructor(defaultSortBy: string, options: PaginationOptions) {
        this.defaultSort = defaultSortBy;

        this.page = +options.page || 0;
        this.size = +options.size || 10;
        this.sortBy = options.sortBy || defaultSortBy;
        this.sortDir = options.sortDir || SortDirection.DESC;

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
