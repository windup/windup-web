import {
    Component, Input, Output, EventEmitter, ChangeDetectionStrategy
} from "@angular/core";
import {isFunction} from "util";

@Component({
    templateUrl: './checkboxes.component.html',
    selector: 'wu-checkboxes',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxesComponent
{
    private _options: any[];
    private _checkedOptions: any[];

    private _equalsCallback: (a: any, b: any) => boolean = (a, b) => a === b;
    private _labelCallback: (a: any) => string = (a) => a;
    private _valueCallback: (a: any) => any = (a) => a;

    /**
     * The name of this checkboxes group.
     */
    @Input()
    groupName: string = "checkboxes";

    /**
     * Callback to get item value
     */
    @Input()
    public set valueCallback(callback: (item: any) => any) {
        if (callback && isFunction(callback)) {
            this._valueCallback = callback;
        }
    }

    public get valueCallback() {
        return this._valueCallback;
    }

    /**
     * Callback to compare item from options and checked options
     */
    @Input()
    public set equalsCallback(callback: (a: any, b: any) => boolean) {
        if (callback && isFunction(callback)) {
            this._equalsCallback = callback;
        }
    }

    public get equalsCallback() {
        return this._equalsCallback;
    }

    /**
     * Callback to get item label
     */
    @Input()
    public set labelCallback(callback: (a: any) => string) {
        if (callback && isFunction(callback)) {
            this._labelCallback = callback;
        }
    }

    public get labelCallback() {
        return this._labelCallback;
    }

    /**
     * Set available options
     */
    @Input()
    set options(options: any[]) {
        if (options && !Array.isArray(options)) {
            throw new Error("Invalid value for options. Expecting array, got: " + JSON.stringify(options));
        }

        this._options = options || [];
    }

    get options(): any[] {
        return this._options;
    }

    /**
     * Array of checked options. Could be the same object as option, or object from valueCallback
     */
    @Input()
    public set checkedOptions(checkedOptions: any[]) {
        if (checkedOptions && !Array.isArray(checkedOptions)) {
            throw new Error("Invalid value for checkedOptions. Expecting array, got: " + JSON.stringify(checkedOptions));
        }

        this._checkedOptions = checkedOptions || [];
    }

    public get checkedOptions(): any[] {
        return this._checkedOptions;
    }

    @Output()
    checkedOptionsChange = new EventEmitter<any[]>();

    shouldBeChecked(option: any): boolean {
        console.log("shouldBeChecked() called.", option, this.checkedOptions);

        if (!this.checkedOptions)
            return false;

        return this.checkedOptions.some(checkedOption => this.equalsCallback(option, checkedOption));
    }

    handleCheckboxChange(option: any, $event)  {
        let checked = $event.target ? $event.target.checked : false;
        let index = this.checkedOptions.findIndex((checkedOption) => this.equalsCallback(checkedOption, option));

        if (!checked && index != -1)
            this.checkedOptions.splice(index, 1);
        else
            this.checkedOptions.push(option);
        
        this.checkedOptionsChange.emit(this.checkedOptions);
    }
}
