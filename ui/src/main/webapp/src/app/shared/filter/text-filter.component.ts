import {
    AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input,
    Output
} from "@angular/core";

@Component({
    selector: 'wu-text-filter',
    templateUrl: './text-filter.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextFilterComponent implements AfterViewInit {
    _filterableAttributes: string[] = [];

    @Input()
    filterCallback: (filter: FilterOption, item: any) => boolean;

    @Output()
    setFilter = new EventEmitter<FilterOption>();

    selectedAttribute: string = '';

    filterText: string = '';

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

    public selectAttribute(attribute: string) {
        this.selectedAttribute = attribute;
    }

    public addFilter() {
        const filter: FilterOption = {
            name: this.selectedAttribute,
            value: this.filterText
        };
        if (this.filterCallback) {
            filter.callback = (item: any) => this.filterCallback(filter, item);
        }

        this.setFilter.next(filter);
        this.resetFilter();
    }

    public resetFilter() {
        this.filterText = '';
    }
}

export interface FilterOption<T = any> {
    name: string;
    value: T;
    field?: string;
    callback?: (item: any) => boolean;
}
