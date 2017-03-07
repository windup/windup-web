import {ComponentFixture, TestBed} from "@angular/core/testing";
import {DebugElement, Component, ViewChild} from "@angular/core";
import {By} from "@angular/platform-browser";
import {RouterTestingModule} from "@angular/router/testing";
import {CheckboxesComponent} from "../../../src/app/shared/checkboxes.component";

let comp:    CheckboxesComponent;
let fixture: ComponentFixture<CheckboxesComponent>;
let de:      DebugElement;
let el:      HTMLElement;

let host:  ComponentFixture<CheckboxesComponentHost>;

@Component({
    template: `<wu-checkboxes [options]="options" [checkedOptions]="checkedOptions"></wu-checkboxes>`
})
class CheckboxesComponentHost {
    public options = [];
    public checkedOptions = [];

    @ViewChild(CheckboxesComponent)
    public checkBoxes;
}

describe('CheckboxesComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ RouterTestingModule ],
            declarations: [
                CheckboxesComponent, CheckboxesComponentHost
            ]
        }).compileComponents();

        host = TestBed.createComponent(CheckboxesComponentHost);

        fixture = TestBed.createComponent(CheckboxesComponent);
        comp = fixture.componentInstance;

        de = fixture.debugElement.query(By.css('div.checkboxes-component'));
        el = de.nativeElement;
    });

     describe('For simple values', () => {
        let items = ['hello', 'world', '42', 'whatever'];

        beforeEach(() => {
            comp.options = items;
        });

        it('should display checkbox with label for each item', () => {
            fixture.detectChanges();

            let labels = fixture.debugElement.queryAll(By.css('label'));

            expect(labels.length).toEqual(items.length);

            let textValues = labels.map(el => el.nativeElement.textContent.trim());

            items.forEach(item => {
                expect(textValues).toContain(item);
            })
        });

        // TODO: this test should be done differently
        xit('should fire change event when item is selected', () => {
            let mock = jasmine.createSpyObj('Spy', ['checkedOptionsChange']);

            comp.checkedOptions = [];
            comp.checkedOptionsChange = mock.checkedOptionsChange;

            fixture.detectChanges();

            clickOnItems(fixture, [ items[0] ]);

            fixture.detectChanges();

            expect(mock.checkedOptionsChange).toHaveBeenCalled();
            expect(mock.checkedOptionsChange).toHaveBeenCalledWith([ items[0] ]);
        });

        it('should update checkedOptions when item is selected', () => {
            comp.checkedOptions = [];
            fixture.detectChanges();

            clickOnItems(fixture, [ items[0] ]);

            fixture.detectChanges();

            expect(comp.checkedOptions.length).toBe(1);
            expect(comp.checkedOptions).toContain(items[0]);
        });

         it('should update checkedOptions when selected item is unselected', () => {
             comp.checkedOptions = [ items[0] ];
             fixture.detectChanges();

             clickOnItems(fixture, [ items[0] ]);

             fixture.detectChanges();

             expect(comp.checkedOptions.length).toBe(0);
         });

        it('should automatically select items based on checkedOptions', () => {
            let expectedCheckedItems = ['hello', 'world'];
            comp.checkedOptions = expectedCheckedItems;

            fixture.detectChanges();

            let labels = fixture.debugElement.queryAll(By.css('label'));

            let checkboxItems = new Map<string, boolean>();

            let checkboxValues = labels.map(element => {
                checkboxItems.set(element.children[0].properties['value'], element.children[0].properties['checked']);

                return {
                    text: element.children[0].properties['value'],
                    checked: element.children[0].properties['checked']
                };
            });

            let selectedValues = checkboxValues.filter(item => item.checked);

            expect(selectedValues.length).toBe(expectedCheckedItems.length);

            expectedCheckedItems.forEach(checkedItem => {
                expect(checkboxItems.get(checkedItem)).toBe(true);
            })
        });

        // TODO: Find out how to test component with OnPush change detection
        xit('should automatically update selection when checkedOptions changes', () => {
            let initiallyCheckedItems = ['hello', 'world'];
            comp.checkedOptions = initiallyCheckedItems;
            fixture.detectChanges();

            let newCheckedItems = ['42'];
            comp.checkedOptions = newCheckedItems;
            fixture.detectChanges();

            let selectionMap = getSelectionMap(fixture);

            let expectedUncheckedItems = items.filter(item => newCheckedItems.indexOf(item) === -1);

            newCheckedItems.forEach(item => {
                expect(selectionMap.get(item)).toBe(true);
            });

            expectedUncheckedItems.forEach(item => {
                expect(selectionMap.get(item)).toBe(false);
            });
        });

        xit('should automatically update displayed checkboxes when options changes', () => {
            // first change detection for first value
            fixture.detectChanges();

            let newOptions = ['Orange', 'Apple'];

            comp.options = newOptions;
            // second change detection for updated value
            fixture.changeDetectorRef.markForCheck();
            fixture.changeDetectorRef.detectChanges();
            fixture.detectChanges();

            let labels = fixture.debugElement.queryAll(By.css('label'));
            expect(labels.length).toEqual(newOptions.length);

            let textValues = labels.map(el => el.nativeElement.textContent.trim());

            newOptions.forEach(item => {
                expect(textValues).toContain(item);
            })
        });
    });

    describe('For object values', () => {
        let valueObjects = [
            { value: 'Hello value' },
            { value: 'World value' },
            { value: 'Secret of the Universe' }
        ];

        let items = [
            { id: 1, label: 'Hello', value: valueObjects[0] },
            { id: 2, label: 'World', value: valueObjects[1] },
            { id: 3, label: '42', value: valueObjects[2] }
        ];

        beforeEach(() => {
            comp.options = items;
        });

        it('should use labelCallback function to get label', () => {
            let mock = jasmine.createSpyObj('Spy', ['getLabel']);
            mock.getLabel.and.callFake(item => item.label);
            comp.labelCallback = mock.getLabel;

            fixture.detectChanges();

            let labels = fixture.debugElement.queryAll(By.css('label'));

            expect(mock.getLabel).toHaveBeenCalledTimes(items.length);
            expect(labels.length).toEqual(items.length);

            let textValues = labels.map(el => el.nativeElement.textContent.trim());

            items.forEach(item => {
                expect(textValues).toContain(item.label);
            });
        });

        describe('when using valueCallback function to get value', () => {
            let mock;

            beforeEach(() => {
                mock = jasmine.createSpyObj('Spy', ['getValue']);
                mock.getValue.and.callFake(item => item.value);
                comp.valueCallback = mock.getValue;
                comp.checkedOptions = [];
            });

            it('should return value when item is clicked', () => {
                fixture.detectChanges();

                clickOnItems(fixture, [ items[0].value ]);

                fixture.detectChanges();

                expect(comp.checkedOptions.length).toBe(1);
                expect(comp.checkedOptions[0]).toBe(valueObjects[0]);
            });
        });

        describe('when no comparator provided', () => {
            let selectedItems;

            beforeEach(() => {
                selectedItems = [ items[0], Object.assign({}, items[1]) ];
            });

            // TODO: How should it behave when unknown object is in checkedOptions?
            it('should use default object equality comparator', () => {
                comp.labelCallback = (item) => item.label;
                comp.checkedOptions = selectedItems;

                fixture.detectChanges();

                let allOptionsArray = getSelectionArray(fixture);
                let selectedOptionsArray = allOptionsArray.filter(item => item.checked);

                expect(selectedOptionsArray.length).toBe(1);
                expect(selectedOptionsArray[0].value).toBe(items[0]);
            });
        });

        describe('when custom comparator provided', () => {
            let selectedItems;

            beforeEach(() => {
                comp.equalsCallback = (option: any, checkedOption: any) => option.id === checkedOption;
                selectedItems = [ items[0].id ];
            });

            it('should properly identify selected objects', () => {
                comp.labelCallback = (item) => item.label;
                comp.checkedOptions = selectedItems;

                fixture.detectChanges();

                let allOptionsArray = getSelectionArray(fixture);
                let selectedOptionsArray = allOptionsArray.filter(item => item.checked);

                expect(selectedOptionsArray.length).toBe(1);
                expect(selectedOptionsArray[0].value).toBe(items[0]);
            });
        });
    });
});

function getSelectionArray(fixture: ComponentFixture<CheckboxesComponent>) {
    let labels = fixture.debugElement.queryAll(By.css('label'));

    return labels.map(element => {
        return {
            value: element.children[0].properties['value'],
            checked: element.children[0].properties['checked']
        };
    });
}

function getSelectionMap(fixture: ComponentFixture<CheckboxesComponent>): Map<string, boolean> {
    let labelElements = fixture.debugElement.queryAll(By.css('label'));

    let checkboxItems = new Map<string, boolean>();

    labelElements.forEach(element => {
        checkboxItems.set(element.children[0].properties['value'], element.children[0].properties['checked']);
    });

    return checkboxItems;
}

function assertSelection(map: Map<any, boolean>, expectChecked: any[], expectNotChecked: any[]) {
    expectChecked.forEach(item => {
        expect(map.get(item)).toBe(true);
    });

    expectNotChecked.forEach(item => {
        expect(map.get(item)).toBe(false);
    });
}

function clickOnItems(fixture: ComponentFixture<CheckboxesComponent>, items: any[]) {
    let labels = fixture.debugElement.queryAll(By.css('label'));

    items.forEach(item => {
        let firstItem = labels.find(element => element.children[0].properties['value'] === item);

        if (!firstItem) {
            throw new Error('Item not found in list' + JSON.stringify(item));
        }

        firstItem.children[0].nativeElement.click();

        fixture.detectChanges();
    });
}
