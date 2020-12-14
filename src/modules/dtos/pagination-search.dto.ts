import { IsOptional } from 'class-validator';
import { Pagination } from './pagination.dto';
import { HiveApiModelProperty } from '../decorators';
import { PaginationOptions } from '../interfaces';

export class PaginationSearch extends Pagination {
    @HiveApiModelProperty(`Term to search by`)
    @IsOptional()
    search: string | any;

    searchTerm: string;

    constructor(defaultSortBy: string, options: PaginationOptions) {
        super(defaultSortBy, options);

        this.searchTerm = options.search;
    }
}
