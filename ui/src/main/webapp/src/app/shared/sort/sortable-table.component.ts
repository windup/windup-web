import {Input, Component, EventEmitter, Output, ChangeDetectionStrategy} from "@angular/core";
import {SortingService, OrderDirection} from "./sorting.service";

@Component({
    selector: '[wu-sortable-table]',
    templateUrl: './sortable-table.component.html',
    providers: [SortingService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`th { cursor: pointer; }`]
})
export class SortableTableComponent {
    private _originalData: any[];
    private _tableHeaders: TableHeader[];
    public sort: SortConfiguration;

    @Input()
    public sortedData: any[] = [];

    @Output()
    public sortedDataChange: EventEmitter<any[]> = new EventEmitter<any[]>();

    public constructor(private _sortingService: SortingService<any>) {
        this.sort = {
            direction: OrderDirection.ASC,
            property: () => 0,
            isInitial: true
        };
    }

    @Input()
    public set initialSortBy(sortBy) {
        if (!sortBy) {
            sortBy = {
                direction: OrderDirection.ASC,
                property: () => 0
            };
        }

        if (this.sort.isInitial) {
            this.sort = sortBy;
        }

        this._sortingService.orderBy(this.sort.property, this.sort.direction);
    }

    @Input()
    public set data(inputData: any[]) {
        this._originalData = inputData || [];
        // this.sortData();
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
            this._sortingService.setOrderDirection(this.sort.direction);
        } else {
            this._sortingService.orderBy(property, this.sort.direction);
            this.sort.property = property;
        }

        this.sortData();
    }

    protected sortData() {
        this.sortedData = this._sortingService.sort(this._originalData);
        this.sortedDataChange.emit(this.sortedData);
        console.log(this.sortedData);
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
    sortBy: string|Function;
}
