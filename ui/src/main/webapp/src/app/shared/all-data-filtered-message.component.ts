import {Component, Input, ChangeDetectionStrategy, Output, EventEmitter, OnChanges, SimpleChanges} from "@angular/core";

@Component({
    selector: 'wu-all-data-filtered-message',
    templateUrl: './all-data-filtered-message.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllDataFilteredMessageComponent implements OnChanges {
    @Input()
    filteredItems: any[] = [];

    @Input()
    unfilteredItems: any[] = [];

    @Input()
    dataFilteredOut: boolean = false;

    showFilteredOutMessage = false;

    @Output()
    clearFilter = new EventEmitter<void>();

    ngOnChanges(changes: SimpleChanges): void {
        this.showFilteredOutMessage = (this.filteredItems.length === 0 && this.unfilteredItems.length > 0) || this.dataFilteredOut;
    }
}
