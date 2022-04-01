import { IsOptional } from 'class-validator';
import { Pagination } from './pagination.dto';
import { HiveApiModelProperty } from '../decorators';
import { PaginationOptions } from '../interfaces';

export class PaginationSearch extends Pagination {
    @HiveApiModelProperty(`Term to search by`)
    @IsOptional()
    search: string | any;

    searchTerm: string;

    constructor(options: PaginationOptions, defaultSortBy: string) {
        super(options, defaultSortBy);

        this.searchTerm = options.search;
    }
}
