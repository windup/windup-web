import { Component, Input, Output, EventEmitter, forwardRef } from "@angular/core";
import { ControlValueAccessor, Validator, NG_VALUE_ACCESSOR, NG_VALIDATORS, AbstractControl, ValidationErrors } from "@angular/forms";

export interface Path {
    id: number;
    children?: Path[];
    icon?: string;
    label: string;
    selected: boolean;
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

    @Input()
    paths: Path[];

    @Output()
    onPathChange: EventEmitter<Path[]> = new EventEmitter<Path[]>();

    private selectedPaths: Path[] = [];

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
        this.paths = obj;
        if (this.paths && this.paths.length > 0) {
            this.emitPathChangeEvent();
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
        return (this.selectedPaths && this.selectedPaths.length > 0) ? null : {
            required: {
                valid: false
            }
        };
    };

    // Bussiness logic


    protected onCardClick(path: Path): void {
        path.selected = !path.selected;
        this.emitPathChangeEvent();
    }

    protected onCheckboxClick(path: Path): void {
        path.selected = !path.selected;
        this.emitPathChangeEvent();
    }

    protected onDropdownChange(path: Path, selectedChildPath: number): void {
        path.selected = true;

        // Change the selected status of Path children
        const pathChildren: Path[] = path.children;
        if (pathChildren && pathChildren.length > 0) {
            pathChildren.forEach(child => {
                if (child.id == selectedChildPath) {
                    child.selected = true;
                } else {
                    child.selected = false;
                }
            });
        }

        this.emitPathChangeEvent();
    }

    private emitPathChangeEvent(): void {
        let mappedMaps: Path[] = [];

        // Remove selected parents and replace by children
        for (let index = 0; index < this.paths.length; index++) {
            const path = this.paths[index];
            if (path.selected) {
                const pathChildren: Path[] = path.children;
                if (pathChildren && pathChildren.length > 0) {
                    mappedMaps = mappedMaps.concat(pathChildren);
                } else {
                    mappedMaps.push(path);
                }
            }
        }

        this.selectedPaths = mappedMaps.filter(path => path.selected);

        // Emit event
        this.onPathChange.emit(this.selectedPaths);

        // Change Model (NgForm)
        this._onChange(this.paths);
    }

}