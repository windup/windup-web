import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";

@Component({
    selector: 'wu-pagination',
    templateUrl: './pagination.component.html',
    styles: [
        `.disabled a {
            cursor: not-allowed;
            pointer-events: none;
        }
        .pagination>li>a>.i, .pagination>li>span>.i {
            font-size: 16px;
        }
        `
    ]
})
export class PaginationComponent implements OnChanges {
    countPages: number;

    @Input()
    countItems: number;

    @Input()
    itemsPerPage: number;

    @Input()
    activePage: number = 1;

    @Output()
    activePageChange = new EventEmitter<number>();

    public previous() {
        this.showPage(this.activePage - 1);
    }

    public next() {
        this.showPage(this.activePage + 1);
    }

    public showPage(page: number) {
        this.activePage = page;
        this.activePageChange.emit(this.activePage);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.itemsPerPage != 0) {
            this.countPages = Math.ceil(this.countItems / this.itemsPerPage);
        }
    }

    range(countItems: number, first: number = 1, step: number = 1) {
        const items = new Array(countItems);

        for (let i = 0, value = first; i < countItems; i++, value += step) {
            items[i] = value;
        }

        return items;
    }
}
