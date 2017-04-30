import {NgModel} from "@angular/forms";
import {Component, Input, ViewChildren, QueryList, ElementRef, Renderer , forwardRef} from "@angular/core";
import {InternalChosenOption, ChosenOption, ChosenOptionGroup} from "./chosen-commons";
import {AbstractChosenComponent} from "./chosen-abstract";
import {ChosenDropComponent} from "./chosen-drop.component";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const ChosenSingleComponent_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ChosenSingleComponent),
    multi: true
};

@Component({
    selector: 'chosen-single',
    templateUrl: './chosen-single.component.html',
    providers: [ChosenSingleComponent_CONTROL_VALUE_ACCESSOR]
})
export class ChosenSingleComponent extends AbstractChosenComponent<string> {

    @Input()
    no_results_text = AbstractChosenComponent.NO_RESULTS_TEXT_DEFAULT;

    @Input() allow_single_deselect: boolean = false;

    @Input()
    placeholder_text_single: string = "Select an Option";

    @Input()
    disable_search = false;

    @Input()
    disable_search_threshold: number = 0;

    @Input()
    max_shown_results = null;

    @Input()
    set options(options: ChosenOption[]) {
        super.setOptions(options);
    }

    @Input()
    protected set groups(groups: ChosenOptionGroup[]) {
        super.setGroups(groups);
    }

    @ViewChildren(ChosenDropComponent)
    private chosenDropComponentQueryList: QueryList<ChosenDropComponent>;

    private singleSelectedOption: InternalChosenOption;

    constructor(protected el: ElementRef, protected renderer: Renderer) {
        super(el, renderer);
    }

    ngAfterViewInit() {
        this.chosenDropComponent = this.chosenDropComponentQueryList.first;
    }

    isSearchDisabled() {
        return this.disable_search
            || (this.disable_search_threshold != 0 && this._options != null && this._options.length <= this.disable_search_threshold);
    }

    isOptionInitiallySelected(option: InternalChosenOption): boolean {
        return this.initialValue == option.value;
    }

    protected initialSelection(initialSelection: InternalChosenOption[]) {
        if (initialSelection != null && initialSelection.length > 0) {
            this.singleSelectedOption = initialSelection[0];
        }
    }

    isSelectionEmpty(): boolean {
        return this.singleSelectedOption == null;
    }

    updateModel() {
        if (this.singleSelectedOption == null) {
            this.onChange(null);
        }
        else {
            this.onChange(this.singleSelectedOption.value);
        }
    }

    selectOption(option) {
        this.singleSelectedOption = option;
        option.selected = true;
        this.updateModel();
        this.chosenBlur();
    }

    deselectOption(option, $event) {
        if ($event != null) {
            $event.stopPropagation();
        }
        option.selected = false;
        this.chosenDropComponent.unHighlight(option);
        this.singleSelectedOption = null;
        this.updateModel();
    }

    onChosenFocus(): boolean {
        this.chosenDropComponent.inputFocus();
        return true;
    }

    protected getOptionToHighlight() {
        if (this.singleSelectedOption != null) {
            return this.singleSelectedOption;
        }
    }

    onChosenBlur() {

    }
}
