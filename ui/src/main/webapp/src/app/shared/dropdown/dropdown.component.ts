import { Input, Output, EventEmitter, Component, ElementRef, AfterViewInit } from "@angular/core";
import * as $ from 'jquery';
import 'bootstrap';

export interface DropdownItem {
    id: string;
    label: string;
}

@Component({
    selector: 'wu-dropdown',
    templateUrl: './dropdown.component.html'
})
export class DropdownComponent implements AfterViewInit {

    @Input()
    _items: DropdownItem[];

    @Output()
    selectionChange: EventEmitter<DropdownItem> = new EventEmitter<DropdownItem>();

    selectedItem: DropdownItem;

    public constructor(private _element: ElementRef) {

    }

    ngAfterViewInit(): void {
        $(this._element.nativeElement).find('.dropdown-toggle').dropdown();
    }

    public get items(): DropdownItem[] {
        return this._items;
    }

    @Input()
    public set items(items: DropdownItem[]) {
        this._items = items;
        if (!this.selectedItem && this._items && this._items.length > 0) {
            this.selectedItem = this._items[0];            
        }
    }

    protected changeSelection(item: DropdownItem): void {
        this.selectedItem = item;
        this.selectionChange.emit(this.selectedItem);
    }

}
