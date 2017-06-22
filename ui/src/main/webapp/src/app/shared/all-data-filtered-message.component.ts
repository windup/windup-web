import {Component, Input, ChangeDetectionStrategy, Output, EventEmitter} from "@angular/core";

@Component({
    selector: 'wu-all-data-filtered-message',
    templateUrl: './all-data-filtered-message.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllDataFilteredMessageComponent {
    @Input()
    filteredItems: any[] = [];

    @Input()
    unfilteredItems: any[] = [];

    @Output()
    clearFilter = new EventEmitter<void>();
}
