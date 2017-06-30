import {
    AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input,
    Output
} from "@angular/core";
import {FilterOption} from "./text-filter.component";

@Component({
    selector: 'wu-dropdown-filter',
    templateUrl: './dropdown-filter.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [ `.dropdown-input-group { display: flex; flex-direction: row; justify-content: space-between; }` ]
})
export class DropdownFilterComponent implements AfterViewInit {
    private _filterableAttributes: string[] = [];
    private _filterOptions: any[] = [];

    @Input()
    selectedAttribute: string = '';

    selectedOption: any;

    getOptionLabelCallback = (option) => option.name;

    @Output()
    selectedAttributeChange = new EventEmitter<string>();

    @Output()
    setFilter = new EventEmitter<FilterOption>();

    public constructor(protected _element: ElementRef) {
    }

    ngAfterViewInit(): void {
        $(this._element.nativeElement).find('.dropdown-toggle').dropdown();
    }

    @Input()
    public set filterableAttributes(attributes: string[]) {
        if (attributes) {
            this._filterableAttributes = attributes;
            this.selectedAttribute = attributes[0];
        }
    }

    public get filterableAttributes() {
        return this._filterableAttributes;
    }

    @Input()
    public set filterOptions(options: FilterOption[]) {
        if (options) {
            this._filterOptions = options;
        }
    }

    public get filterOptions() {
        return this._filterOptions;
    }

    public selectAttribute(attribute: string) {
        this.selectedAttribute = attribute;
        this.selectedAttributeChange.next(this.selectedAttribute);
    }

    public selectOption(option: FilterOption) {
        this.selectedOption = null; //option;
        this.setFilter.next(option as any);
    }
}
