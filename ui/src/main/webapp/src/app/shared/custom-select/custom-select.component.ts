import {Input, Output, EventEmitter, SimpleChange, Component, OnChanges} from "@angular/core";

interface InputVariables {
    options: any[];
    selection: any[];
}

export interface ComparatorCallback<T> {
    (a: T, b: T): boolean;
}

export interface Comparator<T> {
    equals(a: T, b: T): boolean;
}


export interface CustomSelectConfiguration {
    comparator?: Comparator<any> | ComparatorCallback<any>,
    getLabel?: {(any): string};
}

@Component({
    selector: 'wu-custom-select',
    templateUrl: './custom-select.component.html'
})
export class CustomSelectComponent implements OnChanges {
    @Input()
    name: string;

    @Input()
    options: any[];

    @Input()
    selection: any[];

    @Input()
    configuration: CustomSelectConfiguration;

    /**
     * true value in event emmiter prevents 'Expression has changed after it was checked.' exception.
     *
     * @type {EventEmitter<any[]>}
     */
    @Output()
    selectionChange: EventEmitter<any[]> = new EventEmitter<any[]>(true);

    public constructor() {

    }

    /**
     * This needs to handle race condition, when selected value comes before available options.
     * Also configuration could come anytime later.
     *
     * When:
     *  1) Selection changes - update with current selection
     *  2) Options changes - update with last selection
     *  3) Configuration changes - update with last selection
     *
     * @param changes
     */
    ngOnChanges(changes: {configuration: SimpleChange, selection: SimpleChange, options: SimpleChange}): any {
        if (changes.options || (changes.selection && this.hasSelectionChanged(changes.selection))) {
            this.refreshSelection(this.selection);
        }
    }

    protected hasSelectionChanged(selection: SimpleChange): boolean {
        let previous: any[] = selection.previousValue;
        let current: any[] = selection.currentValue;

        if (previous === current) {
            return false;
        }

        if (previous.length !== current.length) {
            return true;
        }

        // perform deep change detection
        for (let i = 0; i < previous.length; i++) {
            if (!this.compare(previous[i], current[i])) {
                 return true;
            }
        }

        return false;
    }

    refreshSelection(selectedItems: any[]) {
        if (!this.isInitialized() || !selectedItems) {
            return;
        }

        let selectedIndices = [];

        selectedItems.forEach((selection) => {
            for (let index = 0; index < this.options.length; index++) {
                let option = this.options[index];

                if (this.compare(option, selection)) {
                    selectedIndices.push(index);
                    break;
                }
            }
        });

        this.selection = selectedIndices.map(index => this.options[index]);
        this.updateSelectedValue(this.selection);
    }

    updateSelectedValue(selection: any[]) {
        if (this.isInitialized()) {
            this.selectionChange.next(selection);
        }
    }

    protected isInitialized() {
        return this.options && this.options.length > 0;
    }

    getLabel(option: any): string {
        if (this.configuration.getLabel) {
            return this.configuration.getLabel(option);
        } else if (typeof option === 'string' || typeof option === 'number' || typeof option === 'boolean') {
            return <string>option;
        } else {
            throw new Error(`Cannot get label for input type: ${option}`);
        }
    }

    compare(a: any, b: any): boolean {
        if (this.configuration.comparator) {
            if (typeof this.configuration.comparator === 'object') {
                if (!this.configuration.comparator.equals || typeof this.configuration.comparator.equals !== 'function') {
                    throw new Error(`Comparator must be either Comparator<T> object or ComparatorCallback<T> function`);
                }

                return this.configuration.comparator.equals(a, b);
            } else if (typeof this.configuration.comparator === 'function') {
                return this.configuration.comparator(a, b);
            } else {
                throw new Error(`Comparator must be either Comparator<T> object or ComparatorCallback<T> function`);
            }
        }

        return a === b;
    }
}
