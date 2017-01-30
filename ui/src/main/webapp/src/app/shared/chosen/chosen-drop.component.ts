import {Component, Input, Output, ViewChildren, EventEmitter} from "@angular/core";
import {InternalChosenOption, InternalChosenOptionGroup} from "./chosen-commons";

@Component({
    selector: 'div.chosen-drop',
    templateUrl: './chosen-drop.component.html'
})
export class ChosenDropComponent {

    inputValue: string;

    @Input()
    disableSearch = false;

    @Input()
    no_results_text;

    @Input()
    display_selected_options: boolean = false;

    @Input()
    filterMode: boolean = false;

    @Output()
    optionSelected: EventEmitter<InternalChosenOption> = new EventEmitter();

    @Output()
    inputKeyUp: EventEmitter<string> = new EventEmitter();

    @Output()
    inputBlur: EventEmitter<boolean> = new EventEmitter();

    @ViewChildren('chosenInput')
    chosenInputQueryList;

    @Input()
    set options(options: InternalChosenOption[]) {
        this._options = options;
    }

    @Input()
    set groups(groups: InternalChosenOptionGroup[]) {
        this._groups = groups;
    }

    _options: InternalChosenOption[];

    _groups: InternalChosenOptionGroup[];

    highlightedOption: InternalChosenOption;

    highlight(option: InternalChosenOption) {
        if (this.highlightedOption != null) {
            this.highlightedOption.highlighted = false;
        }
        if (!this.isOptionSelected(option) || this.display_selected_options) {
            option.highlighted = true;
            this.highlightedOption = option;
        }
    }

    unHighlight(option: InternalChosenOption) {
        option.highlighted = false;
    }

    getOptionLabel(option): string {
        if (this.filterMode) {
            return option.labelWithMark;
        } else {
            return option.label;
        }
    }

    selectOption(option) {
        this.optionSelected.emit(option)
    }

    isOptionSelected(option) {
        return option.selected;
    }

    onInputKeyup(value) {
        this.inputKeyUp.emit(value);
    }

    onInputBlur() {
        this.inputValue = null;
        this.inputBlur.emit(true);
    }

    inputFocus() {
        this.chosenInputQueryList.first.nativeElement.focus();
    }

    showGroup(option: InternalChosenOption, i: number) {
        if (option.group != null && option.groupObject != null) {
            if (i == 0) {
                return true;
            } else {
                return this._options[i - 1].group != option.group;
            }
        } else {
            return false;
        }
    }
}
