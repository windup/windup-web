import {EventEmitter, Output, Input, Component} from "@angular/core";

@Component({
    selector: 'wu-search',
    templateUrl: './search.component.html',
    styleUrls: [
        './search.component.scss'
    ]
})
export class SearchComponent {
    private _searchValue: string;

    @Input()
    set searchValue(value: string) {
        this._searchValue = value;
    }

    get searchValue(): string {
        return this._searchValue;
    }

    @Output()
    public searchValueChange: EventEmitter<string> = new EventEmitter<string>();

    update(value: string) {
        this._searchValue = value;
        this.searchValueChange.emit(this._searchValue);
    }

    clear() {
        this.update('');
    }
}
