import {
    Component, Input, ElementRef, Output, EventEmitter, ChangeDetectionStrategy
} from "@angular/core";

export type ItemType = any;

@Component({
    templateUrl: './checkboxes.component.html',
    selector: 'wu-checkboxes',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxesComponent
{
    private _options: ItemType[];

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
    valueCallback: (item: any) => string
        = app => { throw new Error("valueCallback not yet defined.") };

    @Input()
    labelCallback: (item: ItemType) => string;

    @Input()
    equalsCallback: (item1: ItemType, item2: ItemType) => boolean = (item1, item2) => {
        return this.valueCallback(item1) == this.valueCallback(item2);
    };

    /**
     * All available options.
     */
    @Input()
    set options(options: ItemType[]){
        this._options = options;
        //console.log("set options()", options);
        if (!options)
            return; // May be loaded async.
        if (!Array.isArray(options))
            throw new Error("Invalid @Input value for options: " + JSON.stringify(options));
    }

    get options(): ItemType[] {
        return this._options;
    }

    /**
     * This can be either the values or a subset of options.
     */
    @Input()
    checkedOptions: ItemType[] = [];

    @Output()
    checkedOptionsChange = new EventEmitter<ItemType[]>();

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
