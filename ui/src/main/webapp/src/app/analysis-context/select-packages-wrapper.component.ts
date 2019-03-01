import {
    Component, forwardRef, Output, EventEmitter, Input
} from "@angular/core";
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor, Validator, AbstractControl, ValidationErrors } from "@angular/forms";
import { Package } from "../generated/windup-services";
import { PackageSelection } from "./select-packages.component";

@Component({
    selector: 'wu-select-packages-wrapper',
    templateUrl: './select-packages-wrapper.component.html',
    styleUrls: ['./select-packages-wrapper.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectPackagesWrapperComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => SelectPackagesWrapperComponent),
        multi: true,
    }]
})
export class SelectPackagesWrapperComponent implements ControlValueAccessor, Validator {

    @Output('onSelectionChange')
    onSelectionChange: EventEmitter<Package[]> = new EventEmitter();

    // @Input
    _packages: Package[];

    applicationPackages: Package[];
    applicationPackagesSelection = {
        selectedPackages: [],
        unselectedPackages: []
    } as PackageSelection;

    thirdPartyPackages: Package[];
    thirdPartyPackagesSelection = {
        selectedPackages: [],
        unselectedPackages: []
    } as PackageSelection;

    commonNodesPackages = new Map<number, Package>();
    commonNodesApplicationPackages = new Map<number, Package>();
    commonNodesThirdPartyPackages = new Map<number, Package>();

    // NgForm value
    value: Package[];
    excludedPackages: Package[];

    private _onChange = (_: any) => { };
    private _onTouched = () => { };

    constructor() { }

    @Input()
    set packages(packages: Package[]) {
        this._packages = packages;
        if (this._packages) {
            this.processPackages();
        }
    }

    // ControlValueAccessor interface implementations


    /**
     * 
     * Called to write data from the model to the view
     */
    writeValue(obj: any): void {
        if (obj) {
            this.value = obj;
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
        let isApplicationPackageSelectionValid = true;
        if (this.applicationPackages && this.applicationPackages.length > 0) {
            // applicationPackages - applicationPackagesSelection.selectedPackage
            const arrayDifference = this.applicationPackages.filter((obj1) => {
                return !this.applicationPackagesSelection.selectedPackages.some((obj2) => {
                    return obj1.fullName == obj2.fullName;
                });
            });
            isApplicationPackageSelectionValid = arrayDifference.length > 0;
        }

        let isThirdPartyPackageSelectionValid = true;
        if (this.thirdPartyPackages && this.thirdPartyPackages.length > 0) {
            // thirdPartyPackages - thirdPartyPackagesSelection.selectedPackage
            const uniqueResultOne = this.thirdPartyPackages.filter((obj) => {
                return !this.thirdPartyPackagesSelection.selectedPackages.some((obj2) => {
                    return obj.fullName == obj2.fullName;
                });
            });
            isThirdPartyPackageSelectionValid = uniqueResultOne.length > 0;
        }

        let valid = false;
        if (this.applicationPackages.length > 0 && this.thirdPartyPackages.length > 0) {
            valid = isApplicationPackageSelectionValid || isThirdPartyPackageSelectionValid;
        } else {
            if (this.applicationPackages.length > 0) {
                valid = isApplicationPackageSelectionValid;
            } else if (this.thirdPartyPackages.length > 0) {
                valid = isThirdPartyPackageSelectionValid;
            }
        }

        return valid ? null : {
            nothingToAnalyze: {
                valid: false
            }
        };
    };


    //


    /**
     * Takes packages passed from outside and separate into 2 new arrays: applicationPackages, thirdPartyPackages
     */
    private processPackages(): void {
        const applicationPackages = [];
        const thirdPartyPackages = [];

        this.separatePackages(this._packages, applicationPackages, thirdPartyPackages);

        this.applicationPackages = applicationPackages;
        this.thirdPartyPackages = thirdPartyPackages;
    }

    private separatePackages(packages: Package[], applicationPackages: Package[], thirdPartyPackages: Package[]): void {
        for (let i = 0; i < packages.length; i++) {
            const node = packages[i];

            const newNode1 = Object.assign({}, node, { childs: [] });
            const newNode2 = Object.assign({}, node, { childs: [] });

            if (node.known) {
                if (node.childs && node.childs.some(p => p.known == false)) {
                    applicationPackages.push(newNode1);
                    thirdPartyPackages.push(newNode2);

                    // Save common nodes
                    this.commonNodesPackages.set(node.id, node);
                    this.commonNodesApplicationPackages.set(newNode1.id, newNode1);
                    this.commonNodesThirdPartyPackages.set(newNode2.id, newNode2);
                } else {
                    thirdPartyPackages.push(newNode2);
                }
            } else {
                applicationPackages.push(newNode1);
            }

            if (node.childs) {
                this.separatePackages(node.childs, newNode1.childs, newNode2.childs);
            }
        }
    }


    //


    changeApplicationPackagesSelection($event: PackageSelection): void {
        this.applicationPackagesSelection = $event;
        this.updateValue();
    }

    changeThirdPartyPackagesSelection($event: PackageSelection): void {
        this.thirdPartyPackagesSelection = $event;
        this.updateValue();
    }

    /**
     * Updates 'NgModel' value when select or unselect events occur
     */
    updateValue(): void {
        let excludedPackages: Package[] = [];

        const commonExclutions = new Map<number, Package>();

        this.applicationPackagesSelection.selectedPackages.forEach(element => {
            if (this.commonNodesPackages.has(element.id)) {

                if (!this.containsPackageByFullName(element, this.thirdPartyPackagesSelection.selectedPackages)) {
                    this.getAllMapValuesWhichFullNameStartsWith(element, this.commonNodesApplicationPackages)
                        .forEach(el => {
                            excludedPackages = excludedPackages.concat(el.childs);
                        });
                } else {
                    commonExclutions.set(element.id, element);
                }
            } else {
                excludedPackages.push(element);
            }
        });

        this.thirdPartyPackagesSelection.selectedPackages.forEach(element => {
            if (this.commonNodesPackages.has(element.id)) {

                if (!this.containsPackageByFullName(element, this.applicationPackagesSelection.selectedPackages)) {
                    this.getAllMapValuesWhichFullNameStartsWith(element, this.commonNodesThirdPartyPackages)
                        .forEach(el => {
                            excludedPackages = excludedPackages.concat(el.childs);
                        });
                } else {
                    commonExclutions.set(element.id, element);
                }
            } else {
                excludedPackages.push(element);
            }
        });


        for (const v of commonExclutions.values()) {
            excludedPackages.push(v);
        }

        excludedPackages.sort((a, b) => a.fullName.localeCompare(b.fullName));

        this.excludedPackages = excludedPackages;
        this.value = excludedPackages;

        // Change Model (NgForm)
        this._onChange(this.value);

        // Emit event
        this.onSelectionChange.emit(this.value);
    }

    private getAllMapValuesWhichFullNameStartsWith(node: Package, map: Map<number, Package>): Package[] {
        const result: Package[] = [];

        const startsWith: string = node.fullName + '.';
        for (const p of map.values()) {
            if (p.fullName.startsWith(startsWith) || p.fullName == node.fullName) {
                result.push(p);
            }
        }

        return result;
    }

    private containsPackageByFullName(node: Package, packages: Package[]): boolean {
        const result: Package = packages.find(p => p.fullName == node.fullName);
        return result ? true : false;
    }

}
