import {Input, Component, EventEmitter, Output, ChangeDetectionStrategy} from "@angular/core";
import {OrderDirection} from "../sort/sorting.service";

/**
 * This components creates sortable table header
 *
 * It provides [(sort)] property with sort configuration.
 * It doesn't do actual sorting, only modifies sort property.
 *
 *
 */
@Component({
    selector: '[wu-table-sort-header]',
    templateUrl: '../sort/sortable-table.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`th { cursor: pointer; }`]
})
export class TableSortHeaderComponent {
    private _tableHeaders: TableHeader[];

    @Input()
    public sort: SortConfiguration;

    @Output()
    public sortChange: EventEmitter<SortConfiguration> = new EventEmitter<SortConfiguration>();

    public constructor() {
    }

    @Input()
    public set tableHeaders(headers: TableHeader[]) {
        this._tableHeaders = headers || [];
    }

    public get tableHeaders(): TableHeader[] {
        return this._tableHeaders;
    }

    sortBy(property: string) {
        this.sort.isInitial = false;

        if (property === this.sort.property) {
            this.sort.direction = (this.sort.direction === OrderDirection.ASC) ? OrderDirection.DESC : OrderDirection.ASC;
        } else {
            this.sort.property = property;
        }

        this.sort = Object.assign({}, this.sort);

        this.sortChange.emit(this.sort);
    }
}

interface SortConfiguration {
    direction: OrderDirection;
    property: string|Function;
    isInitial: boolean;
}

export interface TableHeader {
    isSortable: boolean;
    title: string;
    sortBy?: string|Function;
}
