import { HiveApiModelProperty } from './hive-api-property.decorator';

export const fetchAllResponseFactory: (contentClass: any) => any = (contentClass: any) => {
    class FetchAllResponseClass {
        @HiveApiModelProperty(`The count of total elements.`)
        totalElements: number;

        @HiveApiModelProperty('The content', {
            type: contentClass
        })
        content: any[];

        constructor(findAndCountAll: any) {
            this.totalElements = findAndCountAll.count;
            this.content = findAndCountAll.rows;
        }
    }
    return FetchAllResponseClass;
};
