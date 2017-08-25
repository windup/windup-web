import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'wuFilter',
    pure: true
})
export class FilterPipe implements PipeTransform {

    transform(array: any[], filter: (item: any) => boolean): any {
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
