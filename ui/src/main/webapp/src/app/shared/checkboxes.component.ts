import {Component, OnInit, Input, ElementRef, SimpleChange, Output, EventEmitter, NgZone, OnChanges} from "@angular/core";
import {Package} from "windup-services";
import * as $ from "jquery";
import {RegisteredApplication} from "windup-services";
import {isString} from "util";
import {handleError} from "typings/dist/support/cli";

export type ItemType = any;

@Component({
    templateUrl: './checkboxes.component.html',
    selector: 'wu-checkboxes'
})
export class CheckboxesComponent implements OnInit, OnChanges
{
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
        = app => { throw new Error("valueCallback not yet defined." +
                " This means Angular didn't keep the order of setting @Inputs."); };

    @Input()
    labelCallback: (item: ItemType) => string;

    @Input()
    equalsCallback: (item1: ItemType, item2: ItemType) => boolean;

    /**
     * All available options.
     */
    @Input()
    set options(options: ItemType[]){
        this._options = options;
        console.log("set options()", options);
        if (!options)
            return; // May be loaded async.
        if (!Array.isArray(options))
            throw new Error("Invalid @Input value for options: " + JSON.stringify(options));

        options.forEach(
            option => this.valueToOptionMap.set(this.valueCallback(option), option)
        );
    }
    get options(): ItemType[]{
        return this._options;
    }
    _options: ItemType[];

    // For faster lookup of what option was clicked
    private valueToOptionMap: Map<string, ItemType> = new Map<string, ItemType>();


    /**
     * This can be either the values or a subset of options.
     */
    @Input() //@Output()
    checkedOptions: string[] | ItemType[] = [];

    @Output()
    checkedOptionsChange = new EventEmitter<string[] | ItemType[]>();

    shouldBeChecked(option: ItemType): boolean {
        console.log("shouldBeChecked() called.", option, this.checkedOptions);
        let res = (() => {
            if (!this.checkedOptions)
                return false;

            //if ((<ItemType[]>this.checkedOptions).indexOf(option) != -1)
            if ((<ItemType[]>this.checkedOptions).some(checkedOption => this.equalsCallback(option, checkedOption)))
                return true;

            if ((<string[]>this.checkedOptions).indexOf(this.valueCallback(option)) != -1)
                return true;

            return false;
        })();
        console.log("shouldBeChecked() says " + res);
        return res;
    }

    /**
     * Determines whether the checked options are returned as string values only (see valueCallback),
     * or as a subset of options (object references).
     * This is useful when checkedOptions is empty and we don't know which of these to set.
     */
    @Input()
    checkedOptionsAreValuesOnly: boolean | null = null;

    private initCheckedOptionsAreValuesOnly() {
        if (!this.checkedOptions || this.checkedOptions.length == 0)
            return; // Leave as is.

        this.checkedOptionsAreValuesOnly = isString(this.checkedOptions[0]);
    }

    /// Does this duplicate checkedOptionsChange?
    //@Output()
    //onCheckedChange = new EventEmitter<string[] | ItemType[]>();



    private component: CheckboxesComponent;
    private rootElement;

    public constructor(element: ElementRef, private _zone: NgZone) {
        this.component = this;
        this.rootElement = element.nativeElement;
    }

    public ngOnChanges(changes: {[options: string]: SimpleChange}): any {
        console.warn("onChanges", changes['options']);

        /* /// This is handled by the setter?
        if (changes.hasOwnProperty('options')) {
            let newOptions: CheckboxData[] = changes['options'].currentValue;
            this.options = newOptions;
        }
        */

        if (changes.hasOwnProperty('checkedOptions')) {
            this.checkedOptions = changes['checkedOptions'].currentValue;
        }

        ///this.setChangeHandlersToCheckboxes();
    }

    public ngOnInit() {
        //this.setChangeHandersToCheckboxes();
    }

    private setChangeHandlersToCheckboxes() {
        console.log("setChangeHandersToCheckboxes() called");
        /*setTimeout(() => {
            $(this.rootElement).find(":checkbox")
                .off()
                .change((event, data) => this.updateCheckedValues(event, data));
        }, 2000);*/
    }

    handleCheckboxChange(option: ItemType, $event)  {
        console.log("handleCheckboxChange() called", option, $event);
        //$event.target.checked;
        this.updateCheckedValues();
    }

    private updateCheckedValues(): void {
        //this._zone.run(() => {
            this.checkedOptions = this.getCheckedValues();
            this.checkedOptionsChange.emit(this.checkedOptions);
            //this.onCheckedChange.emit(this.checkedOptions);
        //});
        console.log("updateCheckedValues() done", this.checkedOptions);
    }

    private getCheckedValues(): string[] | ItemType[] {
        let component = this;
        let values = $(this.rootElement).find(":checkbox:checked").map(
            function (i, domElement): string {
                if (!domElement['checked'])
                    return null;
                let val = domElement["value"];

                if (component.checkedOptionsAreValuesOnly)
                    return val;

                let clickedOption = component.valueToOptionMap.get(val);
                if (!clickedOption)
                    return console.warn("Unknown option clicked", val), null;
                else
                    return clickedOption;
            }
        ).get();  // http://api.jquery.com/map/
        return <string[] | ItemType[]> values;
    }

}

export interface CheckboxData {
    value: string,
    label: string,
    data: any,
    checked: boolean
}
