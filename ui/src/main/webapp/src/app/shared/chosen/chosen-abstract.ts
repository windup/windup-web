import {InternalChosenOption, InternalChosenOptionGroup, ChosenOption, ChosenOptionGroup} from "./chosen-commons";
import {ElementRef, Renderer} from "@angular/core";
import {ControlValueAccessor} from "@angular/forms";
import {ChosenDropComponent} from "./chosen-drop.component";

export abstract class AbstractChosenComponent<T> implements ControlValueAccessor {

    protected static NO_RESULTS_TEXT_DEFAULT = "No results match";

    protected chosenDropComponent: ChosenDropComponent;

    protected initialValue: T;

    public _options: InternalChosenOption[];

    public dropOptions: InternalChosenOption[];

    _groups: InternalChosenOptionGroup[];

    public chosenContainerActive: boolean = false;

    public chosenWithDrop: boolean = false;

    inputValue: string;

    filterMode: boolean;

    onChange = (_: any) => {
    };

    onTouched = () => {
    };

    getOptionLabel(option: ChosenOption): string {
        return option.label;
    }

    compareOptions(a: ChosenOption, b: ChosenOption): boolean {
        return a.value === b.value;
    }

    protected _getLabel: (a: any) => string = this.getOptionLabel;
    protected _compareWith: (a: any, b: any) => boolean = this.compareOptions;

    constructor(protected el: ElementRef, protected renderer: Renderer) {

    }

    protected setOptions(options: ChosenOption[]) {
        if (options != null) {
            this._options = options.map(option => {
                return new InternalChosenOption(option, this._getLabel(option), option.group);
            });
            this.updateOptions();
        }
    }

    protected setGroups(groups: ChosenOptionGroup[]) {
        if (groups != null) {
            this._groups = [];
            for (let i = 0; i < groups.length; i++) {
                let group: ChosenOptionGroup = groups[i];
                this._groups.push({value: group.value, label: group.label, index: i});
                this.updateOptions();
            }
        }
    }

    writeValue(value: T): void {
        if (value != null) {
            this.initialValue = value;
            this.updateOptions();
        }
    }

    protected updateOptions() {
        if (this._options != null) {
            if (this.initialValue != null) {
                let initialSelection: InternalChosenOption[] = [];
                this._options.forEach((option: InternalChosenOption) => {
                    if (this.isOptionInitiallySelected(option)) {
                        initialSelection.push(option);
                        option.selected = true;
                    } else {
                        option.selected = false;
                    }
                });
                this.initialSelection(initialSelection);
            }

            if (this._groups != null) {
                this._options.forEach((option: InternalChosenOption) => {
                    if (option.group != null) {
                        let optionGroup: InternalChosenOptionGroup = this._groups.find(group => group.value == option.group);
                        option.groupIndex = optionGroup.index;
                        option.groupObject = optionGroup;
                    } else {
                        option.groupIndex = -1;
                    }
                });
                this._options.sort((a: InternalChosenOption, b: InternalChosenOption) => a.groupIndex - b.groupIndex);
            }
            this.dropOptions = this._options;
        }
    }

    inputKeyUp(inputValue) {
        this.filterMode = true;
        let dropOptions = null;
        if (inputValue.trim().length > 0) {
            this._options.forEach((option: InternalChosenOption) => {
                let indexOf = option.label.toLowerCase().indexOf(inputValue.toLowerCase());
                if (indexOf > -1) {
                    let subString = option.label.substring(indexOf, indexOf + inputValue.length);
                    option.labelWithMark = option.label.replace(subString, `<em>${subString}</em>`);
                    if (dropOptions == null) {
                        dropOptions = [];
                    }
                    dropOptions.push(option);
                }
            });
            this.dropOptions = dropOptions;
            this.filterMode = true;
        } else {
            this.dropOptions = this._options;
            this.filterMode = false;
        }
        this.highlightOption();
    }

    highlightOption() {
        let optionToHighlight = this.getOptionToHighlight();
        if (optionToHighlight != null) {
            this.chosenDropComponent.highlight(optionToHighlight);
        }
    }

    protected abstract getOptionToHighlight(): InternalChosenOption;

    protected abstract isOptionInitiallySelected(InternalChosenOption): boolean;

    protected abstract initialSelection(initialSelection: Array<InternalChosenOption>);

    abstract isSelectionEmpty(): boolean;

    abstract updateModel();

    abstract selectOption(option: InternalChosenOption)

    abstract deselectOption(option: InternalChosenOption, event);

    chosenFocus() {
        if (!this.onChosenFocus()) {
            return;
        }

        this.chosenContainerActive = true;
        this.chosenWithDrop = true;
        this.highlightOption();
    }

    abstract onChosenFocus(): boolean;

    chosenBlur() {
        this.chosenContainerActive = false;
        this.chosenWithDrop = false;
        this.filterMode = false;
        this.onChosenBlur();
    }

    abstract onChosenBlur();

    registerOnChange(fn: (value: any) => any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => any): void {
        this.onTouched = fn;
    }

}
