import {OrderDirection, SortConfiguration} from "../sort/sorting.service";
import {
    ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, OnChanges, Output, SimpleChanges,
    TemplateRef
} from "@angular/core";
import {FilterCallback} from "../filter/filter.pipe";
import {TableHeader} from "./table-sort-header.component";

/**
 * Component for tables
 *
 * Supports sorting and filtering.
 *
 * Example usage:
 * @example
 * ```
 * <wu-data-table [items]="itemsArray" [rowTemplate]="rowTemplate">
 *  <ng-template #rowTemplate let-item>
 *   <tr>
 *       <td class="col-md-2">{{item}}</td>
 *   </tr>
 *   </ng-template>
 * </wu-data-table>
 * ```
 */
@Component({
    selector: 'wu-data-table',
    templateUrl: './data-table.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnChanges {
    /**
     * TemplateRef to row template
     */
    @Input()
    @ContentChild(TemplateRef)
    rowTemplate: TemplateRef<any>;

    /**
     * Data to display
     */
    @Input()
    items: any[];

    filteredItems: any[];

    /**
     * Table headers
     */
    @Input()
    tableHeaders: TableHeader[];

    /**
     * Sort configuration
     *
     * @type {SortConfiguration}
     */
    @Input()
    sort: SortConfiguration = {
        property: () => 0,
        order: OrderDirection.ASC
    } as any;

    /**
     * Filter callback
     */
    @Input()
    filter: FilterCallback;

    /**
     * Title of table panel
     */
    @Input()
    title: string;

    /**
     * Callback which clears the filter
     *
     * @type {EventEmitter<void>}
     */
    @Output()
    clearFilter = new EventEmitter<void>();

    /**
     * Loading indicator.
     *
     * It is shown when no data are available.
     */
    @Input()
    loading: boolean;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('filter') || changes.hasOwnProperty('items')) {
            this.applyFilter();
        }
    }

    applyFilter() {
        let items = this.items || [];

        if (!this.filter) {
            this.filteredItems = items;
        } else {
            this.filteredItems = items.filter(this.filter);
        }
    }

    clearSearch() {
        this.clearFilter.next();
    }
}
