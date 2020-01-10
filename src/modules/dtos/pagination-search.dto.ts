import { IsOptional } from 'class-validator';
import { Pagination } from './pagination.dto';
import { HiveApiModelProperty } from '../decorators';

export class PaginationSearch extends Pagination {
    @HiveApiModelProperty(`Term to search by`)
    @IsOptional()
    search: string | any;
}
