import {
    Component, forwardRef, Output, EventEmitter, Input, ChangeDetectorRef, OnDestroy
} from "@angular/core";
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor, Validator, AbstractControl, ValidationErrors } from "@angular/forms";
import { Package } from "../generated/windup-services";
import { Subscription, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

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
    onSelectionChange: EventEmitter<Package[]> = new EventEmitter();

    // @Input
    _packages: Package[];

    @Input()
    useDefaultValues: Package[];

    applicationPackages: Package[];
    applicationPackagesCheckedNodes: Package[] = [];

    thirdPartyPackages: Package[];
    thirdPartyPackagesCheckedNodes: Package[] = [];

    commonNodesPackages = new Map<number, Package>();
    commonNodesApplicationPackages = new Map<number, Package>();
    commonNodesThirdPartyPackages = new Map<number, Package>();

    // NgForm value
    value: Package[];
    originalValue: Package[];
    excludedPackages: Package[];

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
            this.originalValue = obj;
            this.excludedPackages = obj;
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
            const arrayDifference = this.applicationPackages.filter((obj1) => {
                return !this.applicationPackagesCheckedNodes.some((obj2) => {
                    return obj1.fullName == obj2.fullName;
                });
            });
            isApplicationPackageSelectionValid = arrayDifference.length > 0;
        }

        let isThirdPartyPackageSelectionValid = true;
        if (this.thirdPartyPackages && this.thirdPartyPackages.length > 0) {
            const uniqueResultOne = this.thirdPartyPackages.filter((obj) => {
                return !this.thirdPartyPackagesCheckedNodes.some((obj2) => {
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
    changeApplicationPackagesSelection($event: Package[]): void {
        this.applicationPackagesCheckedNodes = $event;
        // this.updateValue();
        this.updateValueSubject.next();
    }

    /**
     * Manages third party packages selection events
     */
    changeThirdPartyPackagesSelection($event: Package[]): void {
        this.thirdPartyPackagesCheckedNodes = $event;
        // this.updateValue();
        this.updateValueSubject.next();
    }

    /**
     * Updates 'NgModel' value when select or unselect events occur
     */
    updateValue(): void {
        const applicationCheckedPackages: Package[] = this.applicationPackagesCheckedNodes;
        const thirdPartyCheckedPackages: Package[] = this.thirdPartyPackagesCheckedNodes;

        let excludedPackages = new Map<string, Package>();
        let commonExcludedPackages = new Set<string>();

        const processCheckedPackages = (packages1: Package[], packages2: Package[], commonNodes1: Map<number, Package>) => {
            packages1.forEach((node1: Package) => {
                // If node exists on both trees: applicationPackages, thirdPartyPackages
                if (this.commonNodesPackages.has(node1.id)) {
                    // If node is already excluded in packages2
                    if (this.isNodeAlreadyIncludedInArray(node1, packages2)) {
                        excludedPackages.set(node1.fullName, node1);

                        // Just for cleaning
                        commonExcludedPackages.add(node1.fullName);
                    } else {
                        this.getAllPackagesWhichFullNameStartsWithNodeFullName(node1, Array.from(commonNodes1.values()))
                            .map((p: Package) => p.childs)
                            .forEach((childs: Package[]) => {
                                childs.filter((p: Package) => {
                                    return !commonNodes1.has(p.id);
                                }).forEach((p: Package) => {
                                    excludedPackages.set(p.fullName, p);
                                })
                            });
                    }
                } else {
                    excludedPackages.set(node1.fullName, node1);
                }
            });
        };

        processCheckedPackages(applicationCheckedPackages, thirdPartyCheckedPackages, this.commonNodesApplicationPackages);
        processCheckedPackages(thirdPartyCheckedPackages, applicationCheckedPackages, this.commonNodesThirdPartyPackages);

        // Clean exclution under common nodes
        for (const fullName of excludedPackages.keys()) {
            Array.from(commonExcludedPackages.values()).forEach(commonExclutionFullName => {
                if (fullName.startsWith(commonExclutionFullName + ".")) {
                    excludedPackages.delete(fullName);
                }
            });
        };

        const result: Package[] = Array.from(excludedPackages.values());

        this.excludedPackages = result;
        this.value = result;

        // Change Model (NgForm)        
        this._onChange(this.value);

        // // Emit event
        this.onSelectionChange.emit(this.value);
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
