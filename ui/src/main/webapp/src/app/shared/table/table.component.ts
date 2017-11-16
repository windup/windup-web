import {OrderDirection, SortConfiguration} from "../sort/sorting.service";
import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, EventEmitter, Input, NgZone, OnChanges, Output,
    SimpleChanges,
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
 * <wu-table [items]="itemsArray" [rowTemplate]="rowTemplate">
 *  <ng-template #rowTemplate let-item>
 *   <tr>
 *       <td class="col-md-2">{{item}}</td>
 *   </tr>
 *   </ng-template>
 * </wu-table>
 * ```
 */
@Component({
    selector: 'wu-table',
    templateUrl: './table.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnChanges {
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
     * When all data are filtered out
     *
     * @type {EventEmitter<boolean>}
     */
    @Output()
    dataFilteredOut = new EventEmitter<boolean>();

    constructor(protected _changeDetection: ChangeDetectorRef, protected _zone: NgZone) {}

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

        /**
         * This is workaround to run this task after change detection is finished.
         *
         * Otherwise Angular would throw following error:
         *  ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked
         *
         */
        this._zone.runOutsideAngular(() => setTimeout(() => this._zone.run(() => {
            let filteredOut = this.filteredItems.length === 0 && items.length > 0;
            this.dataFilteredOut.emit(filteredOut);
        }), 0));
    }
}
