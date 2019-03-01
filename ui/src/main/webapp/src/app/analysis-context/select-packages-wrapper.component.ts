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
    private _packages: Package[];

    customerPackages: Package[];
    thirdPartyPackages: Package[];

    commonNodes = new Map<number, Package>();
    commonNodesCustomer = new Map<number, Package>();
    commonNodesThirdParty = new Map<number, Package>();

    loading: boolean = false;

    // NgForm value
    value: Package[];

    excludedPackages: Package[];

    private customerPackagesSelection = {
        selectedPackages: [],
        unselectedPackages: []
    } as PackageSelection;

    private thirdPartyPackagesSelection = {
        selectedPackages: [],
        unselectedPackages: []
    } as PackageSelection;

    private _onChange = (_: any) => { };
    private _onTouched = () => { };

    constructor() { }

    @Input()
    set packages(packages: Package[]) {
        this._packages = packages;
        if (this._packages) {
            this.loading = true;
            this.processPackages();
            this.loading = true;
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
        let customerValidSelection = true;
        if (this.customerPackages && this.customerPackages.length > 0) {

            const uniqueResultOne = this.customerPackages
                .filter((obj) => {
                    return !this.customerPackagesSelection.selectedPackages
                        .some((obj2) => obj.fullName == obj2.fullName);
                });

            customerValidSelection = uniqueResultOne.length > 0;
        }

        let thirdPartyValidSelection = true;
        if (this.thirdPartyPackages && this.thirdPartyPackages.length > 0) {
            const uniqueResultOne = this.thirdPartyPackages
                .filter((obj) => {
                    return !this.thirdPartyPackagesSelection.selectedPackages
                        .some((obj2) => obj.fullName == obj2.fullName);
                });

            thirdPartyValidSelection = uniqueResultOne.length > 0;
        }

        let result = false;
        if (this.customerPackages.length > 0 && this.thirdPartyPackages.length > 0) {
            result = customerValidSelection || thirdPartyValidSelection;
        } else {
            if (this.customerPackages.length > 0) {
                result = customerValidSelection;
            } else if (this.thirdPartyPackages.length > 0) {
                result = thirdPartyValidSelection;
            }
        }

        return result ? null : {
            nothingToAnalyze: {
                valid: false
            }
        };
    };


    //


    private processPackages(): void {
        const customerPackages = [];
        const thirdPartyPackages = [];

        this.separatePackages(this._packages, customerPackages, thirdPartyPackages);

        this.customerPackages = customerPackages;
        this.thirdPartyPackages = thirdPartyPackages;
    }

    private separatePackages(packages: Package[], customerPackages: Package[], thirdPartyPackages: Package[]): void {
        for (let i = 0; i < packages.length; i++) {
            const node = packages[i];

            const newNode1 = Object.assign({}, node, { childs: [] });
            const newNode2 = Object.assign({}, node, { childs: [] });

            if (node.known) {
                if (this.anyChildIsUnknown(node)) {
                    customerPackages.push(newNode1);
                    thirdPartyPackages.push(newNode2);

                    // Save common nodes
                    this.commonNodes.set(node.id, node);
                    this.commonNodesCustomer.set(newNode1.id, newNode1);
                    this.commonNodesThirdParty.set(newNode2.id, newNode2);
                } else {
                    thirdPartyPackages.push(newNode2);
                }
            } else {
                customerPackages.push(newNode1);
            }

            if (node.childs) {
                this.separatePackages(node.childs, newNode1.childs, newNode2.childs);
            }
        }
    }

    private anyChildIsUnknown(singlePackage: Package): boolean {
        if (singlePackage.childs) {
            for (let i = 0; i < singlePackage.childs.length; i++) {
                const node = singlePackage.childs[i];
                if (!node.known) {
                    return true;
                }
            }
        }
        return false;
    }


    //


    changeCustomerPackagesSelection($event: PackageSelection): void {
        $event.selectedPackages.forEach
        this.customerPackagesSelection = $event;
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

        this.customerPackagesSelection.selectedPackages.forEach(element => {
            if (this.commonNodes.has(element.id)) {

                if (!this.containsPackageByFullName(element, this.thirdPartyPackagesSelection.selectedPackages)) {
                    this.getAllMapValuesWhichFullNameStartsWith(element, this.commonNodesCustomer)
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
            if (this.commonNodes.has(element.id)) {

                if (!this.containsPackageByFullName(element, this.customerPackagesSelection.selectedPackages)) {
                    this.getAllMapValuesWhichFullNameStartsWith(element, this.commonNodesThirdParty)
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
