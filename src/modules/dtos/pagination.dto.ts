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

    @HiveApiModelProperty(`The number of results to shift the offset by`)
    @IsNumber()
    @IsOptional()
    shift: number;

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

    secondarySort?: any;

    static defaultSortDir: SortDirection = 'DESC';

    constructor(options: PaginationOptions, defaultSortBy: string) {
        this.defaultSort = defaultSortBy;

        options.page = options.page === undefined ? 0 : +options.page;
        options.size = options.size === undefined ? 10 : +options.size;
        options.shift = options.shift === undefined ? 0 : +options.shift;

        // If size or page is -1, then leave these undefined
        if (Number(options.size) >= 0 && Number(options.page) >= 0) {
            this.page = options.page;
            this.size = options.size;
            this.shift = options.shift;
            this.offset = this.page * this.size + this.shift;

            // if offset less than 0 due to shift, set to zero
            if (this.offset < 0) {
                this.offset = 0;
            }
        }
        this.sortBy = options.sortBy || defaultSortBy;
        this.sortDir = options.sortDir || Pagination.defaultSortDir;
    }

    getOrderBy(options = {} as OrderBy) {
        const sortBy = [];

        // primary sort
        if (this.sortByModel) {
            if (Array.isArray(this.sortByModel)) {
                sortBy.push([...this.sortByModel, this.sortBy, this.sortDir]);
            } else {
                sortBy.push([this.sortByModel, this.sortBy, this.sortDir]);
            }
        } else {
            sortBy.push([this.sortBy, this.sortDir]);
        }

        //secondary sort
        if (this.secondarySort) {
            sortBy.push(this.secondarySort);
        }

        // default sort by to ensure consistent pagination regardless of collisions
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
