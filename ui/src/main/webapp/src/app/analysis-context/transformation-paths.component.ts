import { Component, Input, Output, EventEmitter, forwardRef } from "@angular/core";
import { ControlValueAccessor, Validator, NG_VALUE_ACCESSOR, NG_VALIDATORS, AbstractControl, ValidationErrors } from "@angular/forms";

export interface Path {
    id: number;
}

export interface CardPath extends Path {
    icon: string;
    label: string;
    selected?: boolean;
    children?: DropdownPath[];
    selectedChild?: DropdownPath
}

export interface DropdownPath extends Path {
    label: string;
}

@Component({
    selector: 'wu-transformation-paths',
    templateUrl: './transformation-paths.component.html',
    styleUrls: ['./transformation-paths.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TransformationPathsComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => TransformationPathsComponent),
        multi: true,
    }]
})
export class TransformationPathsComponent implements ControlValueAccessor, Validator {

    private _cardPaths: CardPath[] = [];

    get cardPaths(): CardPath[] {
        return this._cardPaths;
    };

    @Input()
    set cardPaths(cardPaths: CardPath[]) {
        this._cardPaths = cardPaths;
        if (this._cardPaths) {
            // Select first child if there is no selected child
            this.cardPaths
                .filter(cardPath => cardPath.children && cardPath.children)
                .filter(cardPath => !cardPath.selectedChild)
                .forEach(cardPath => cardPath.selectedChild = cardPath.children[0]);
        }
    }

    @Output()
    onPathChange: EventEmitter<Path[]> = new EventEmitter<Path[]>();

    value: Path[] = [];

    private _onChange = (_: any) => { };
    private _onTouched = () => { };

    public constructor() {

    }


    // ControlValueAccessor methods
    

    /**
     * 
     * Called to write data from the model to the view
     */
    writeValue(obj: any): void {
        this.value = <Path[]>obj;
        if (this.value) {
            // Update view from model
            for (let index = 0; index < this.cardPaths.length; index++) {
                const cardPath = this.cardPaths[index];
                if (cardPath.children && cardPath.children.length > 0) {
                    for (let j = 0; j < cardPath.children.length; j++) {
                        const dropdownPath = cardPath.children[j];
                        if (this.searchPathIndexById(this.value, dropdownPath.id) != -1) {
                            cardPath.selected = true;
                            cardPath.selectedChild = dropdownPath;
                        }
                    }
                } else {
                    if (this.searchPathIndexById(this.value, cardPath.id) != -1) {
                        cardPath.selected = true;
                    }
                }
            }
        }
    }

    /**
     * Registers reaction on changing in the UI
     */
    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    /**
     * Registers reaction on receiving a blur event (is emitted when an element has lost focus)
     */
    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    /**
     * called on Disabled status changes
     */
    setDisabledState(isDisabled: boolean): void {
        console.log("disabled not supported for this component");
    }


    // Validators


    validate(control: AbstractControl): ValidationErrors | null {
        return (this.value && this.value.length > 0) ? null : {
            required: {
                valid: false
            }
        };
    };


    // Bussiness logic


    protected onCardClick(card: CardPath): void {
        card.selected = !card.selected;
        this.updateValue();
    }

    protected onCheckboxCardClick(card: CardPath): void {
        card.selected = !card.selected;
        this.updateValue();
    }

    protected onDropdownChange(card: CardPath): void {
        card.selected = true;
        this.updateValue();
    }

    private updateValue(): void {
        const selectedPaths: Path[] = [];

        // Remove selected parents and replace by children
        for (let index = 0; index < this.cardPaths.length; index++) {
            const cardPath = this.cardPaths[index];
            if (cardPath.selected) {
                if (cardPath.children && cardPath.children.length > 0) {
                    if (cardPath.selectedChild) {
                        selectedPaths.push(cardPath.selectedChild);
                    }
                } else {
                    selectedPaths.push(cardPath);
                }
            }
        }

        this.value = selectedPaths;

        // Change Model (NgForm)
        this._onChange(this.value);

        // Emit event
        this.onPathChange.emit(this.value);
    }

    private searchPathIndexById(paths: Path[], id: number): number {
        for (let index = 0; index < paths.length; index++) {
            const path: Path = paths[index];
            if (path.id == id) {
                return index;
            }
        }
        return -1;
    }
    
}