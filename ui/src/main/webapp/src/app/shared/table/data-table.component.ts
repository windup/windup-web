import {OrderDirection, SortConfiguration} from "../sort/sorting.service";
import {
    ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output,
    TemplateRef
} from "@angular/core";

@Component({
    selector: 'wu-data-table',
    templateUrl: './data-table.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent {
    @Input()
    @ContentChild(TemplateRef)
    rowTemplate: TemplateRef<any>;

    @Input()
    data: any[];

    @Input()
    unfilteredData: any[];

    @Input()
    tableHeaders;

    @Input()
    sort: SortConfiguration = {
        property: () => 0,
        order: OrderDirection.ASC
    } as any;

    @Input()
    filter;

    @Input()
    title: string;

    @Output()
    clearFilter = new EventEmitter<void>();

    @Input()
    loading: boolean;

    clearSearch() {
        this.clearFilter.next();
    }
}
