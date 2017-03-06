import {
    Component, Input, ElementRef, Output, EventEmitter, ChangeDetectionStrategy
} from "@angular/core";
import {isFunction} from "util";

export type ItemType = any;

@Component({
    templateUrl: './checkboxes.component.html',
    selector: 'wu-checkboxes',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxesComponent
{
    private _options: ItemType[];
    private _checkedOptions: ItemType[];

    private _equalsCallback: (a: any, b: any) => boolean = (a, b) => a === b;
    private _labelCallback: (a: any) => string = (a) => a;
    private _valueCallback: (a: any) => any = (a) => a;

    private component: CheckboxesComponent;
    private rootElement;

    /**
     * The name of this checkboxes group.
     */
    @Input()
    groupName: string = "checkboxes";

    /**
     * Callbacks
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

    @Input()
    public set equalsCallback(callback: (a: any, b: any) => boolean) {
        if (callback && isFunction(callback)) {
            this._equalsCallback = callback;
        }
        //         return this.valueCallback(item1) == this.valueCallback(item2);

    }

    public get equalsCallback() {
        return this._equalsCallback;
    }

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
     * All available options.
     */
    @Input()
    set options(options: ItemType[]) {
        if (options && !Array.isArray(options)) {
            throw new Error("Invalid value for options. Expecting array, got: " + JSON.stringify(options));
        }

        this._options = options || [];
    }

    get options(): ItemType[] {
        return this._options;
    }

    /**
     * This can be either the values or a subset of options.
     */
    @Input()
    public set checkedOptions(checkedOptions: ItemType[]) {
        if (checkedOptions && !Array.isArray(checkedOptions)) {
            throw new Error("Invalid value for checkedOptions. Expecting array, got: " + JSON.stringify(checkedOptions));
        }

        this._checkedOptions = checkedOptions || [];
    }

    public get checkedOptions() {
        return this._checkedOptions;
    }

    @Output()
    checkedOptionsChange = new EventEmitter<string[] | ItemType[]>();

    shouldBeChecked(option: ItemType): boolean {
        console.log("shouldBeChecked() called.", option, this.checkedOptions);

        if (!this.checkedOptions)
            return false;

        if ((<ItemType[]>this.checkedOptions).some(checkedOption => this.equalsCallback(option, checkedOption)))
            return true;

        return false;
    }

    public constructor(element: ElementRef) {
        this.component = this;
        this.rootElement = element.nativeElement;
    }

    handleCheckboxChange(option: ItemType, $event)  {
        let checked = $event.target ? $event.target.checked : false;
        let index = this.checkedOptions.findIndex((checkedOption) => this.equalsCallback(checkedOption, option));
        //console.log("Index: " + index);

        //console.log("handleCheckboxChange() called", this.labelCallback(option), checked);
        if (!checked && index != -1)
            this.checkedOptions.splice(index, 1);
        else
            this.checkedOptions.push(option);
        this.checkedOptionsChange.emit(this.checkedOptions);
    }
}
