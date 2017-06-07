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
    filterOptions: FilterOption[];
    selectedFilters: FilterOption[];
    countFilteredItems: number;
}

@Component({
    selector: 'wu-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {

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
            ...this.filterConfiguration.selectedFilters.filter(item => item.name !== filter.name),
            filter
        ];
        this.updateFilters();
    }

    updateFilters() {
        this.filterChange.next(this.filterConfiguration.selectedFilters);
    }

    isFilterActive() {
        return this.filterConfiguration.selectedFilters.length > 0;
    }
}
