import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'wuFilter',
    pure: true
})
export class FilterPipe implements PipeTransform {

    transform(array: any[], filter: FilterCallback): any {
        console.log('FilterPipe called', {
            data: array,
            params: filter
        });

        if (!filter) {
            return array;
        }

        return array.filter(filter);
    }
}

export interface FilterCallback<T = any> {
    (item: T): boolean
}
