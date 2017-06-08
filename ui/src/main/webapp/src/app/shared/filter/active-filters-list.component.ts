import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {FilterOption} from "./text-filter.component";

@Component({
    selector: 'wu-active-filters-list',
    templateUrl: './active-filters-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActiveFiltersListComponent {
    @Input()
    activeFilters: FilterOption[] = [];

    @Output()
    activeFiltersChange: EventEmitter<FilterOption[]> = new EventEmitter<FilterOption[]>();

    @Input()
    countResults: number;

    removeFilter(filter: FilterOption) {
        this.activeFilters = this.activeFilters.filter(item => item.name !== filter.name);
        this.updateFilters();
    }

    clearFilters() {
        this.activeFilters = [];
        this.updateFilters();
    }

    protected updateFilters() {
        this.activeFiltersChange.next(this.activeFilters);
    }
}
