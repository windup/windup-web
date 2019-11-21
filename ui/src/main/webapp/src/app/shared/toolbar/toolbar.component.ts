import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {SortOption} from "../sort/sort.component";
import {OrderDirection} from "../sort/sorting.service";
import {FilterOption} from "../filter/text-filter.component";

export interface SortConfiguration {
    sortOptions: SortOption[];
    selectedOption: SortOption;
    direction: OrderDirection;
}

export interface FilterConfiguration {
    filterableAttributes?: string[];
    selectedAttribute?: string;
    filterOptions?: FilterOption[]; // To use in case it is 'dropwdown'
    filterCallback?: (filter: FilterOption, item: any) => boolean; // To use in case is 'text'
    selectedFilters: FilterOption[];
    countFilteredItems: number;
    getLabel?: (filter: FilterOption) => string;
}

@Component({
    selector: 'wu-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {

    @Input()
    filterType: string = 'dropdown';

    @Input()
    sortConfiguration: SortConfiguration;

    @Input()
    filterConfiguration: FilterConfiguration;

    @Output()
    filterChange = new EventEmitter();

    @Output()
    sortChange = new EventEmitter();

    updateSort() {
        this.sortChange.emit(this.sortConfiguration);
    }

    addFilter(filter: FilterOption) {
        this.filterConfiguration.selectedFilters = [
            ...this.filterConfiguration.selectedFilters.filter(item => item.field !== filter.field),
            filter
        ];
        this.updateFilters();
    }

    updateFilters() {
        this.filterChange.next(this.filterConfiguration);
    }
}
