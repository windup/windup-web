import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from "@angular/core";
import {OrderDirection} from "../services/sorting.service";

@Component({
    selector: 'wu-sort',
    templateUrl: './sort.component.html',
    styleUrls: [
        './sort.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortComponent {
    private _sortOptions: SortOption[] = [];
    private _selectedOption: SortOption;
    private _direction: OrderDirection = OrderDirection.ASC;

    private isOpen = false;

    @Input()
    public set sortOptions(sortOptions: SortOption[]) {
        this._sortOptions = sortOptions;

        if (!this._selectedOption && sortOptions && sortOptions.length > 0) {
            this._selectedOption = sortOptions[0];
        }
    }

    public get sortOptions() {
        return this._sortOptions;
    }

    @Input()
    public set direction(direction: OrderDirection) {
        this._direction = direction;
    }

    public get direction() {
        return this._direction;
    }

    @Output()
    public directionChange: EventEmitter<OrderDirection> = new EventEmitter<OrderDirection>();

    @Input()
    public set selectedOption(sortOption: SortOption) {
        this._selectedOption = sortOption;
    }

    public get selectedOption() {
        return this._selectedOption;
    }

    @Output()
    public selectedOptionChange: EventEmitter<SortOption> = new EventEmitter<SortOption>();

    @Output()
    public onChange: EventEmitter<SortChangeEvent> = new EventEmitter<SortChangeEvent>();

    constructor() {

    }

    selectOption(option: SortOption) {
        this.close();

        this._selectedOption = option;
        this.selectedOptionChange.emit(option);
        this.update();
    }

    toggle() {
        this.isOpen = !this.isOpen;
    }

    open() {
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
    }

    changeDirection() {
        this._direction = -this._direction;
        this.directionChange.emit(this._direction);
        this.update();
    }

    update() {
        this.onChange.emit({
            selectedOption: this.selectedOption,
            direction: this.direction
        });
    }
}

export interface SortOption {
    name: string;
    field?: string;
    comparator?: (a: any, b: any) => number;
}

export interface SortChangeEvent {
    selectedOption: SortOption;
    direction: OrderDirection;
}
