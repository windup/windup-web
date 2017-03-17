import {ComponentFixture, TestBed} from "@angular/core/testing";
import {DebugElement, Component, ViewChild} from "@angular/core";
import {By} from "@angular/platform-browser";
import {RouterTestingModule} from "@angular/router/testing";
import {SortableTableComponent, TableHeader} from "../../../../src/app/shared/sort/sortable-table.component";
import {SortIndicatorComponent} from "../../../../src/app/shared/sort/sort-indicator.component";
import {OrderDirection} from "../../../../src/app/shared/sort/sorting.service";
import {SchedulerServiceMock} from "../../mocks/scheduler-service.mock";
import {SchedulerService} from "../../../../src/app/shared/scheduler.service";

let comp:    SortableTableComponent;
let fixture: ComponentFixture<SortableTableComponent>;
let de:      DebugElement;
let el:      HTMLElement;

let host:  ComponentFixture<SortableTableComponentHost>;

@Component({
    template: `
    <table>
        <thead wu-sortable-table [tableHeaders]="headers" [data]="rows" [(sortedData)]="sortedRows"></thead>
    </table>
`
})
class SortableTableComponentHost {
    public headers: TableHeader[] = [];
    public rows: any[] = [];
    public sortedRows: any[] = [];

    @ViewChild(SortableTableComponent)
    public sortableTable;
}

describe('SortableTableComponentHost', () => {
    let scheduler: SchedulerServiceMock = new SchedulerServiceMock();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ RouterTestingModule ],
            declarations: [
                SortableTableComponent, SortableTableComponentHost, SortIndicatorComponent
            ],
            providers: [
                {
                    provide: SchedulerService,
                    useValue: scheduler
                }
            ]
        }).compileComponents();

        host = TestBed.createComponent(SortableTableComponentHost);

        fixture = TestBed.createComponent(SortableTableComponent);
        comp = fixture.componentInstance;

        de = fixture.debugElement.query(By.css('tr'));
        el = de.nativeElement;
    });

    describe('For table headers', () => {

        it('should load headers', () => {
            let headers =  [
                { title: 'Test Title', isSortable: true, sortBy: 'title' },
                { title: 'Not Sortable', isSortable: false }
            ];

            host.componentInstance.headers = headers;

            host.detectChanges();

            let tableRow = host.debugElement.query(By.css('tr'));
            let columns = tableRow.queryAll(By.css('th'));

            expect(columns.length).toBe(headers.length);

            columns.forEach((column, index) => {
                expect(column.nativeElement.textContent.trim()).toBe(headers[index].title);
            });
        });

        it('should update when headers changes', () => {
            let headers: TableHeader[] = [
                { title: 'Hello World', isSortable: false}
            ];

            host.componentInstance.headers = headers;
            host.detectChanges();

            headers =  [
                { title: 'Test Title', isSortable: true, sortBy: 'title' },
                { title: 'Not Sortable', isSortable: false }
            ];

            host.componentInstance.headers = headers;

            host.detectChanges();

            let tableRow = host.debugElement.query(By.css('tr'));
            let columns = tableRow.queryAll(By.css('th'));

            expect(columns.length).toBe(headers.length);

            columns.forEach((column, index) => {
                expect(column.nativeElement.textContent.trim()).toBe(headers[index].title);
            });
        });
    });

    describe('Sorting', () => {
        let data = [
            { id: 1, title: 'Hello', property: { value: 10 } },
            { id: 2, title: 'World', property: { value: -1 } },
            { id: 3, title: 'Angular', property: { value: 42 } }
        ];

        let headers: TableHeader[] = [
            { title: 'id', isSortable: true, sortBy: 'id' },
            { title: 'title', isSortable: true, sortBy: 'title' }
        ];

        let comparators = {
            id: {
                asc: (a, b) => a.id <= b.id,
                desc: (a, b) => a.id >= b.id
            },
            title: {
                asc: (a, b) => a.title <= b.title,
                desc: (a, b) => a.title >= b.title
            },
        };

        const indicators = {
            inactive: 'fa-sort',
            asc: 'fa-sort-asc',
            desc: 'fa-sort-desc'
        };

        beforeEach(() => {
            host.componentInstance.rows = data;
            host.componentInstance.headers = headers;
        });

        it('should have all sorting indicators inactive by default', () => {
            host.detectChanges();

            let sortingIndicators = host.debugElement.queryAll(By.css('i'));

            sortingIndicators.forEach((indicator, index) => {
                assertIndicatorIsCorrect(host, index, indicators.inactive);
            });
        });

        describe('after clicking on table header', () => {
            beforeEach(() => {
                host.detectChanges();
                clickOnItem(host, headers[0].title);
            });

            it('should sort data', () => {
                assertArrayIsSorted(host.componentInstance.sortableTable, OrderDirection.ASC, comparators.id.asc);
            });

            it('should update sorting indicator', () => {
                assertIndicatorIsCorrect(host, 0, indicators.asc);
            });

            describe('after clicking on the same table header again', () => {
                beforeEach(() => {
                    clickOnItem(host, headers[0].title);
                });

                it('it should sort in opposite order', () => {
                    assertArrayIsSorted(host.componentInstance.sortableTable, OrderDirection.DESC, comparators.id.desc);
                });

                it('should update sorting indicator', () => {
                    assertIndicatorIsCorrect(host, 0, indicators.desc);
                });

                it('should always switch ordering when clicking on the same column', () => {
                    for (let i = 0; i < 4; i++) {
                        clickOnItem(host, headers[0].title);
                        if (i % 2 === 1) {
                            assertArrayIsSorted(host.componentInstance.sortableTable, OrderDirection.DESC, comparators.id.desc);
                            assertIndicatorIsCorrect(host, 0, indicators.desc);
                        } else {
                            assertArrayIsSorted(host.componentInstance.sortableTable, OrderDirection.ASC, comparators.id.asc);
                            assertIndicatorIsCorrect(host, 0, indicators.asc);
                        }
                    }
                });

                it('after clicking on different column, it should sort by that column', () => {
                    clickOnItem(host, headers[1].title);
                    assertArrayIsSorted(host.componentInstance.sortableTable, OrderDirection.DESC, comparators.title.desc);
                    assertIndicatorIsCorrect(host, 1, indicators.desc);
                });
            });

            describe('after clicking on different header', () => {
                beforeEach(() => {
                    clickOnItem(host, headers[1].title);
                });

                it('should sort by different criteria', () => {
                    assertArrayIsSorted(host.componentInstance.sortableTable, OrderDirection.ASC, comparators.title.asc);
                });

                it('should update sorting indicator', () => {
                    assertIndicatorIsCorrect(host, 1, indicators.asc);
                });
            });

            describe('after changing input data', () => {
                let newData = [
                    { id: 1, title: 'Star' },
                    { id: 2, title: 'Wars' },
                    { id: -1, title: 'Stargate' },
                    { id: 42, title: 'Star Trek'}
                ];

                beforeEach(() => {
                    host.componentInstance.rows = newData;
                    host.detectChanges(); // change on input
                    scheduler.timerTick(); // workaround
                    host.detectChanges(); // change on output
                });

                it('should return new data sorted', () => {
                    expect(host.componentInstance.sortedRows.length).toBe(newData.length);
                    assertArrayIsSorted(host.componentInstance.sortedRows, OrderDirection.ASC, comparators.id.asc);
                });
            });
        });

    });
});

function clickOnItem(fixture: ComponentFixture<SortableTableComponentHost>, item: string) {
    let headers = fixture.debugElement.queryAll(By.css('th'));

    let firstItem = headers.find(element => element.nativeElement.textContent.trim() === item);

    if (!firstItem) {
        throw new Error('Item not found in list' + JSON.stringify(item));
    }

    firstItem.nativeElement.click(); //.children[0].nativeElement.click();
    fixture.detectChanges();
}


function assertArrayIsSorted(array: any[], order: OrderDirection = OrderDirection.ASC, comparator?: any) {
    let length = array.length;

    let ascComparator  = (a: any, b: any) => { return a <= b; };
    let descComparator = (a: any, b: any) => { return a >= b; };

    let compareCallback;

    if (!comparator) {
        compareCallback = (order === OrderDirection.ASC) ? ascComparator : descComparator;
    } else {
        compareCallback = comparator;
    }

    for (let i = 0; i < length - 1; i++) {
        if (!compareCallback(array[i], array[i+1])) {
            fail('Array should be sorted');
        }
    }
}

function assertIndicatorIsCorrect(fixture: ComponentFixture<SortableTableComponentHost>, index: number, expectedClass: string) {
    let sortingIndicators = fixture.debugElement.queryAll(By.css('i'));

    sortingIndicators.forEach((indicator, idx) => {
        console.log(indicator.classes);
        expect(indicator.classes['fa']).toBe(true);

        if (idx === index) {
            expect(indicator.classes[expectedClass]).toBe(true);
        } else {
            expect(indicator.classes['fa-sort']).toBe(true);
        }
    });
}

