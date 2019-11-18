import {
    Component, forwardRef, Output, EventEmitter, Input, ChangeDetectorRef, OnDestroy
} from "@angular/core";
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor, Validator, AbstractControl, ValidationErrors } from "@angular/forms";
import { Package } from "../../generated/windup-services";
import { Subscription, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
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
export class SelectPackagesWrapperComponent implements ControlValueAccessor, Validator, OnDestroy {

    @Output('onSelectionChange')
    onSelectionChange: EventEmitter<PackageSelection> = new EventEmitter();

    // @Input
    _packages: Package[];

    @Input()
    useDefaultValues: Package[];

    applicationPackages: Package[];
    applicationPackagesSelection: PackageSelection = {
        includePackages: [],
        excludePackages: []
    };

    thirdPartyPackages: Package[];
    thirdPartyPackagesSelection: PackageSelection = {
        includePackages: [],
        excludePackages: []
    };

    commonNodesPackages = new Map<number, Package>();
    commonNodesApplicationPackages = new Map<number, Package>();
    commonNodesThirdPartyPackages = new Map<number, Package>();

    // NgForm value
    value: PackageSelection;
    originalValue: PackageSelection | boolean;
    includePackages: Package[] = [];
    excludePackages: Package[] = [];

    private _onChange = (_: any) => { };
    private _onTouched = () => { };

    // For avoiding ExpressionChangedAfterItHasBeenCheckedError use timeout or stream delay
    private updateValueSubject = new Subject<Package[]>();
    private subscriptions: Subscription[] = [];

    constructor() {
        this.subscriptions.push(
            this.updateValueSubject.pipe(
                debounceTime(10)
            ).subscribe(() => {
                this.updateValue();
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subs) => subs.unsubscribe());
    }

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
            
            // if includePackages and excludePackages are empty, it means
            // that the user saved the Analysis without selecting any package; so we
            // select all packages by default.
            if (this.value && (this.value.includePackages.length == 0 || this.value.excludePackages.length == 0)) {
                this.originalValue = true;
            } else {
                this.originalValue = obj;
            }
            
            this.includePackages = obj.includePackages;
            this.excludePackages = obj.excludePackages;
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
        const valid: boolean = this.applicationPackagesSelection && this.thirdPartyPackagesSelection && (
            // The user should select at least one package
            (
                this.applicationPackagesSelection.includePackages.length +
                this.thirdPartyPackagesSelection.includePackages.length
            ) > 0 ||
            // If the user did not interact with the component then length must be 0 for all:
            (
                this.applicationPackagesSelection.includePackages.length +
                this.applicationPackagesSelection.excludePackages.length +
                this.thirdPartyPackagesSelection.includePackages.length +
                this.thirdPartyPackagesSelection.excludePackages.length
            ) == 0
        );

        return valid ? null : {
            nothingToAnalyze: {
                valid: false
            }
        };
    };


    /**
     * Takes packages passed from outside and separate into 2 new arrays: applicationPackages, thirdPartyPackages
     */
    private processPackages(): void {
        const applicationPackages = [];
        const thirdPartyPackages = [];

        this.disaggregatePackages(this._packages, applicationPackages, thirdPartyPackages);

        this.applicationPackages = applicationPackages;
        this.thirdPartyPackages = thirdPartyPackages;
    }

    /**
     * Disaggregate recursively an array depending of the 'known' value of the node.
     * @param packages original list of packages
     * @param applicationPackages All unknown packages will be part of this array
     * @param thirdPartyPackages All known packages will be part of this array
     */
    private disaggregatePackages(packages: Package[], applicationPackages: Package[], thirdPartyPackages: Package[]): void {
        for (let i = 0; i < packages.length; i++) {
            const node = packages[i];

            const newNode1 = Object.assign({}, node, { childs: [] });
            const newNode2 = Object.assign({}, node, { childs: [] });

            if (node.known) {
                // If at least one child is unknown, then the node will be part of both Arrays
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
                this.disaggregatePackages(node.childs, newNode1.childs, newNode2.childs);
            }
        }
    }

    /**
     * Manages application packages selection events
     */
    changeApplicationPackagesSelection($event: PackageSelection): void {
        this.applicationPackagesSelection = $event;
        this.updateValueSubject.next();
    }

    /**
     * Manages third party packages selection events
     */
    changeThirdPartyPackagesSelection($event: PackageSelection): void {
        this.thirdPartyPackagesSelection = $event;
        this.updateValueSubject.next();
    }

    /**
     * Updates 'NgModel' value when select or unselect events occur
     */
    updateValue(): void {
        const applicationCheckedPackages: Package[] = this.applicationPackagesSelection.includePackages;
        const thirdPartyCheckedPackages: Package[] = this.thirdPartyPackagesSelection.includePackages;

        const applicationUncheckedPackages: Package[] = this.applicationPackagesSelection.excludePackages;
        const thirdPartyUncheckedPackages: Package[] = this.thirdPartyPackagesSelection.excludePackages;


        let includePackages = new Map<string, Package>();
        let excludePackages = new Map<string, Package>();

        let commonIncludedPackages = new Set<string>();
        let commonExcludedPackages = new Set<string>();

        const processCheckedPackages = (packages1: Package[], packages2: Package[], commonNodes2: Map<number, Package>) => {
            packages1.forEach((node1: Package) => {
                // If node exists on both trees: applicationPackages, thirdPartyPackages
                if (this.commonNodesPackages.has(node1.id)) {
                    // If node is already included in packages2
                    if (this.isNodeAlreadyIncludedInArray(node1, packages2)) {
                        // Include this node and save its reference in a map in order to remove all of its children
                        includePackages.set(node1.fullName, node1);
                        commonIncludedPackages.add(node1.fullName);
                    } else {
                        includePackages.set(node1.fullName, node1);
                    }
                } else {
                    includePackages.set(node1.fullName, node1);
                }
            });
        };

        const processUncheckedPackages = (packages1: Package[], packages2: Package[], commonNodes2: Map<number, Package>) => {
            packages1.forEach((node1: Package) => {
                // If node exists on both trees: applicationPackages, thirdPartyPackages
                if (this.commonNodesPackages.has(node1.id)) {
                    // If node is already excluded in packages2
                    if (this.isNodeAlreadyIncludedInArray(node1, packages2)) {
                        // Exclude this node and save its reference in a map in order to remove all of its children
                        excludePackages.set(node1.fullName, node1);
                        commonExcludedPackages.add(node1.fullName);
                    } else {
                        this.getAllPackagesWhichFullNameStartsWithNodeFullName(node1, Array.from(commonNodes2.values()))
                            .map((p: Package) => p.childs)
                            .forEach((childs: Package[]) => {
                                childs
                                    .filter((p: Package) => {
                                        return !commonNodes2.has(p.id);
                                    })
                                    .forEach((p: Package) => {
                                        excludePackages.set(p.fullName, p);
                                    })
                            });
                    }
                } else {
                    excludePackages.set(node1.fullName, node1);
                }
            });
        };

        processCheckedPackages(applicationCheckedPackages, thirdPartyCheckedPackages, this.commonNodesThirdPartyPackages);
        processCheckedPackages(thirdPartyCheckedPackages, applicationCheckedPackages, this.commonNodesApplicationPackages);

        processUncheckedPackages(applicationUncheckedPackages, thirdPartyUncheckedPackages, this.commonNodesApplicationPackages);
        processUncheckedPackages(thirdPartyUncheckedPackages, applicationUncheckedPackages, this.commonNodesThirdPartyPackages);

        // Clean exclution under common nodes
        for (const fullName of includePackages.keys()) {
            Array.from(commonIncludedPackages.values()).forEach(commonExclutionFullName => {
                if (fullName.startsWith(commonExclutionFullName + ".")) {
                    includePackages.delete(fullName);
                }
            });
        };

        for (const fullName of excludePackages.keys()) {
            Array.from(commonExcludedPackages.values()).forEach(commonExclutionFullName => {
                if (fullName.startsWith(commonExclutionFullName + ".")) {
                    excludePackages.delete(fullName);
                }
            });
        }


        const newValue: PackageSelection = {
            includePackages: Array.from(includePackages.values()),
            excludePackages: Array.from(excludePackages.values())
        }
        this.includePackages = newValue.includePackages;
        this.excludePackages = newValue.excludePackages;


        // Change value only of it really changed
        let valueChanged: boolean;
        if (typeof this.originalValue == "boolean") {
            valueChanged = this.originalValue
                ? !(newValue.includePackages.length > 0 && newValue.excludePackages.length == 0)
                : !(newValue.includePackages.length == 0 && newValue.excludePackages.length > 0);
        } else {
            const oldIncludedIDs = this.originalValue.includePackages.map(elem => elem.id);
            const oldExcludedIDs = this.originalValue.excludePackages.map(elem => elem.id);
            
            const newIncludedIDs = newValue.includePackages.map(elem => elem.id);
            const newExcludedIDs = newValue.excludePackages.map(elem => elem.id);
    
            valueChanged = (oldIncludedIDs.length != newIncludedIDs.length) ||
                           (oldExcludedIDs.length != newExcludedIDs.length) ||
                           oldIncludedIDs.some(elem => !newIncludedIDs.includes(elem)) ||
                           oldExcludedIDs.some(elem => !newExcludedIDs.includes(elem));
        }
        
        if (valueChanged) {
            this.value = newValue;

            // Change Model (NgForm)        
            this._onChange(this.value);

            // // Emit event
            this.onSelectionChange.emit(this.value);
        }
    }

    private isNodeAlreadyIncludedInArray(node: Package, packages: Package[]): boolean {
        return packages.some((p => p.id == node.id || node.fullName.startsWith(p.fullName + ".")));
    }

    private getAllPackagesWhichFullNameStartsWithNodeFullName(node: Package, packages: Package[]): Package[] {
        const startsWith: string = node.fullName + ".";
        return packages.filter(p => {
            return p.fullName.startsWith(startsWith) || p.fullName == node.fullName;
        });
    }

}
