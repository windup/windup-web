import {Pipe, PipeTransform} from "@angular/core";
import {SortConfiguration, SortingService} from "./sorting.service";

@Pipe({
    name: 'wuSort',
    pure: true
})
export class SortPipe implements PipeTransform {

    constructor(protected sortingService: SortingService<any>) {
    }

    transform(array: any[], configuration: SortConfiguration): any {
        console.log('SortPipe called');
        return this.sortingService.sortWithConfiguration(array, configuration);
    }
}
