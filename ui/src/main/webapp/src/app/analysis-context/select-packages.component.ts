import {
    Component,
    Input,
    Output,
    EventEmitter,
    forwardRef,
    ViewChild
} from "@angular/core";
import {
    NG_VALUE_ACCESSOR,
    NG_VALIDATORS,
    ControlValueAccessor,
    Validator,
    AbstractControl,
    ValidationErrors
} from "@angular/forms";
import { Package } from "../generated/windup-services";
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";

export interface PackageSelection {
    includePackages: Package[],
    excludePackages: Package[]
}

export enum ExcludePackagesViewSelector {
    LIST,
    TREE
}

export class PackageFlatNode implements Package {
    id: number;
    name: string;
    fullName: string;
    countClasses: number;
    childs: Package[];
    level: number;
    known: boolean;

    icon: string;
    expandable: boolean;
    flaternName: string;
}

@Component({
    selector: 'wu-select-packages',
    templateUrl: './select-packages.component.html',
    styleUrls: ['./select-packages.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectPackagesComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => SelectPackagesComponent),
        multi: true,
    }]
})
export class SelectPackagesComponent implements ControlValueAccessor, Validator {

    @Output('onSelectionChange')
    onSelectionChange: EventEmitter<PackageSelection> = new EventEmitter();

    @Output()
    onViewThirdPackagesChange: EventEmitter<boolean> = new EventEmitter();

    // @Input
    private _packages: Package[];

    @Input()
    loading: boolean;


    // Tree variables

    treeControl: FlatTreeControl<PackageFlatNode>;
    dataSource: MatTreeFlatDataSource<Package, PackageFlatNode>;
    treeFlattener: MatTreeFlattener<Package, PackageFlatNode>;

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap = new Map<Package, PackageFlatNode>();

    idNestedNodeMap = new Map<number, Package>();
    parentNestedNodeMap = new Map<Package, Package>();

    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<PackageFlatNode, Package>();

    /** The selection for checklist */
    checklistSelection = new SelectionModel<PackageFlatNode>(true /* multiple */);


    @ViewChild('excludedPackageMatTree')
    excludedPackageTree;

    expandExcludePackageTree = () => {
        if (this.excludedPackageTree) {
            this.excludedPackageTree.treeControl.expandAll();
        }
    };
    transformerExcluded = (node: Package, level: number) => {
        return {
            expandable: !!node.childs && node.childs.length > 0,
            name: node.name,
            level: level,
        };
    };
    treeControlExcluded = new FlatTreeControl<PackageFlatNode>(node => node.level, node => node.expandable);
    treeFlattenerExcluded = new MatTreeFlattener(this.transformerExcluded, node => node.level, node => node.expandable, node => node.childs);
    dataSourceExcluded = new MatTreeFlatDataSource(this.treeControlExcluded, this.treeFlattenerExcluded);


    // NgForm value
    value: PackageSelection;
    viewThirdPackages: boolean;

    checkedAll: boolean = false;
    excludePackageViewSelection: ExcludePackagesViewSelector = ExcludePackagesViewSelector.LIST;

    private _onChange = (_: any) => { };
    private _onTouched = () => { };

    public constructor() {
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl<any>(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    }

    get packages(): Package[] {
        return this._packages;
    }

    @Input()
    set packages(packages: Package[]) {
        this._packages = packages;
        if (this._packages) {
            this.clearComponent();

            this.processPackagesBeforeSendingToDatasource(this._packages);
            this.dataSource.data = this._packages;

            this.loadTreeFromValue();
        }
    }

    private clearComponent() {
        this.flatNodeMap.clear();
        this.nestedNodeMap.clear();
        this.parentNestedNodeMap.clear();
        this.idNestedNodeMap.clear();

        this.dataSource.data = [];
        this.checklistSelection.clear();
    }

    private processPackagesBeforeSendingToDatasource(packages: Package[], parent: Package = null): void {
        if (!packages || packages.length < 1) {
            return;
        }
        for (let i = 0; i < packages.length; i++) {
            let node: Package = packages[i];

            // Flatter if possible
            if (node.childs && node.childs.length == 1) {
                while (node.childs && node.childs.length == 1) {
                    node = node.childs[0];
                }

                packages[i] = node;
                node.name = parent ? node.fullName.replace(parent.fullName + '.', '') : node.fullName;
            }

            // Change know
            if (node.known && this.atLeastOneChildIsUnknown(node.childs)) {
                node.known = false;
            }

            this.parentNestedNodeMap.set(packages[i], parent);
            this.idNestedNodeMap.set(packages[i].id, packages[i]);

            this.processPackagesBeforeSendingToDatasource(packages[i].childs, packages[i]);
        }

        packages.sort(this.treeModelComparator);
    }

    private atLeastOneChildIsUnknown(packages: Package[]): boolean {
        for (let i = 0; i < packages.length; i++) {
            const node = packages[i];
            if (!node.known) {
                return true;
            }
            if (node.childs && this.atLeastOneChildIsUnknown(node.childs)) {
                return true;
            }
        }
        return false;
    }

    private treeModelComparator(a: Package, b: Package): number {
        if (a.childs && a.childs.length > 0) {
            if (b.childs && b.childs.length > 0) {
                return a.name > b.name ? 1 : -1;
            } else {
                return 1;
            }
        } else {
            if (b.childs && b.childs.length > 0) {
                return -1;
            } else {
                return a.name > b.name ? 1 : -1;
            }
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

            this.loadTreeFromValue();
        }
    }

    private loadTreeFromValue(): void {
        if (this.value) {
            // Load previous values into the tree
            if (this.value.includePackages.length > 0) {
                // By default all nodes are unchecked so I just need to toggle include packages
                this.toggleNodesUsingDetachedPackages(this.value.includePackages, false);
            } else {
                // Check all nodes
                this.toggleAllNodes(false);

                // Toggle unselected nodes
                this.toggleNodesUsingDetachedPackages(this.value.excludePackages, false);
            }

            // If value is passed from outside, then verify if it has Third party packages
            if (this.value && this.viewThirdPackages == undefined) {
                for (let i = 0; i < this.value.includePackages.length; i++) {
                    if (this.value.includePackages[i].known) {
                        this.viewThirdPackages = true;
                        break;
                    }
                }
            }

            this.updateValue();
        }
    }

    private toggleAllNodes(updateValue: boolean) {
        this._packages.forEach(node => {
            let nodeFlat: PackageFlatNode = this.nestedNodeMap.get(node);
            this.itemSelectionToggle(nodeFlat, updateValue);
        });
    }

    private toggleNodesUsingDetachedPackages(packages: Package[], updateValue: boolean) {
        packages.forEach((node) => {
            const packageNode: Package = this.idNestedNodeMap.get(node.id);
            const packageFlatNode: PackageFlatNode = this.nestedNodeMap.get(packageNode);
            if (packageFlatNode) {
                this.itemSelectionToggle(packageFlatNode, updateValue);
            }
        });
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
        return (this.value && this.value.includePackages && this.value.includePackages.length > 0) ? null : {
            required: {
                valid: false
            }
        };
    };


    // Material Tree methods


    getLevel = (node: PackageFlatNode): number => node.level;

    isExpandable = (node: PackageFlatNode): boolean => node.expandable;

    getChildren = (node: Package): Package[] => node.childs;

    hasChild = (_: number, _nodeData: PackageFlatNode): boolean => _nodeData.expandable;

    trackByFn = (index: number, item: Package) => item.id;

    transformer = (node: Package, level: number): PackageFlatNode => {
        const existingNode: PackageFlatNode = this.nestedNodeMap.get(node);
        const flatNode: PackageFlatNode = (existingNode && existingNode.id === node.id ? existingNode : new PackageFlatNode());

        Object.assign(flatNode, node);
        flatNode.level = level;
        flatNode.expandable = node.childs && node.childs.length > 0;
        flatNode.icon = node.known ? 'fa fa-folder-o' : 'fa fa-folder';

        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);

        return flatNode;
    }

    /** Toggle a leaf item selection. Check all the parents to see if they changed */
    leafItemSelectionToggle(node: PackageFlatNode, updateValue: boolean = true): void {
        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);

        // All checked button
        if (!this.checklistSelection.isSelected(node)) {
            this.checkedAll = false;
        }

        // Update value
        if (updateValue) {
            this.updateValue();
        }
    }

    /* Checks all the parents when a leaf node is selected/unselected */
    checkAllParentsSelection(node: PackageFlatNode): void {
        let parent: PackageFlatNode | null = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }

    /* Get the parent node of a node */
    getParentNode(node: PackageFlatNode): PackageFlatNode | null {
        const nodePackage: Package = this.flatNodeMap.get(node);
        const parentNodePackage: Package = this.parentNestedNodeMap.get(nodePackage);
        return parentNodePackage ? this.nestedNodeMap.get(parentNodePackage) : null;
    }

    /** Check root node checked state and change it accordingly */
    checkRootNodeSelection(node: PackageFlatNode): void {
        const nodeSelected: boolean = this.checklistSelection.isSelected(node);
        const descendants: PackageFlatNode[] = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        if (nodeSelected && !descAllSelected) {
            this.checklistSelection.deselect(node);
        } else if (!nodeSelected && descAllSelected) {
            this.checklistSelection.select(node);
        }
    }

    /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: PackageFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        return descAllSelected;
    }

    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: PackageFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }

    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    itemSelectionToggle(node: PackageFlatNode, updateValue: boolean = true): void {
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node) ? this.checklistSelection.select(...descendants) : this.checklistSelection.deselect(...descendants);

        // Force update for the parent
        descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        this.checkAllParentsSelection(node);

        // All checked button
        if (!this.checklistSelection.isSelected(node)) {
            this.checkedAll = false;
        }

        // Update value
        if (updateValue) {
            this.updateValue();
        }
    }


    // Component events


    /**
     * Handles 3dPackage link button
     */
    viewHide3dPackagesEvent(): void {
        this.viewThirdPackages = !this.viewThirdPackages;
        this.onViewThirdPackagesChange.emit(this.viewThirdPackages);
    }

    /**
    * Change tree checks and fire event to update value
    */
    onCheckedAllChange(value: boolean): void {
        const toggleNodesWithCondition = (condition: boolean) => {
            this._packages.forEach((node) => {
                const nestedNodeMap: PackageFlatNode = this.nestedNodeMap.get(node);
                if (this.checklistSelection.isSelected(nestedNodeMap) != condition) {
                    this.itemSelectionToggle(nestedNodeMap);
                }
            });
        };

        toggleNodesWithCondition(value);
    }

    /**
     * Updates 'NgModel' value when select or unselect events occur
     */
    updateValue(): void {
        this.value = this.getCheckedNodes(this._packages);

        this.createdExcludedTree();
        this.expandExcludePackageTree();

        // Change Model (NgForm)
        this._onChange(this.value);

        // Emit event
        this.onSelectionChange.emit(this.value);
    }

    private getCheckedNodes(packageTree: Package[]): PackageSelection {
        let result: PackageSelection = {
            includePackages: [],
            excludePackages: []
        };

        for (let index = 0; index < packageTree.length; index++) {
            const node: Package = packageTree[index];

            // If a node is checked, then children are checked too. No need to iterate children
            if (this.isPackageChecked(node)) {
                result.includePackages.push(node);
            } else {
                if (node.childs) {
                    let allFirstChildrenAreChecked: boolean = true;
                    for (let index = 0; index < node.childs.length; index++) {
                        const child = node.childs[index];
                        if (!this.isPackageChecked(child)) {
                            allFirstChildrenAreChecked = false;
                            break;
                        }
                    }

                    // If all first children are checked, then no need to iterate children
                    if (allFirstChildrenAreChecked) {
                        result.excludePackages.push(node);
                    } else {
                        //
                        if (this.atLeastOneIsCheckedOnCascade(node.childs)) {
                            let childResult: PackageSelection = this.getCheckedNodes(node.childs);
                            result.includePackages = result.includePackages.concat(childResult.includePackages);
                            result.excludePackages = result.excludePackages.concat(childResult.excludePackages);
                        } else {
                            result.excludePackages.push(node);
                        }
                    }
                } else {
                    result.excludePackages.push(node);
                }
            }
        }

        return result;
    }


    private isPackageChecked(node: Package): boolean {
        const flatNode: PackageFlatNode = this.nestedNodeMap.get(node);
        return this.checklistSelection.isSelected(flatNode);
    }

    private atLeastOneIsCheckedOnCascade(packageTree: Package[]): boolean {
        let result: boolean = false;
        for (let i = 0; i < packageTree.length; i++) {
            const node = packageTree[i];
            if (this.isPackageChecked(node)) {
                result = true;
                break;
            }

            if (node.childs) {
                result = this.atLeastOneIsCheckedOnCascade(node.childs);
            }
            if (result == true) {
                break;
            }
        }
        return result;
    }


    // Excluded tree

    private createdExcludedTree() {
        const excludedTree: Package[] = [];
        for (let i = 0; i < this.value.excludePackages.length; i++) {
            const node = this.value.excludePackages[i];
            this.createNodesFromPackageFullName(node.fullName, excludedTree);
        }

        this.flatternTreeModelsOnCascade(excludedTree);
        this.sortTreeModelOnCascade(excludedTree);

        this.dataSourceExcluded.data = excludedTree;
    }

    /**
     * Create nodes on tree using packageFullName
     */
    private createNodesFromPackageFullName(packageFullName: string, packages: Package[]): void {
        const split: string[] = packageFullName.split('.');
        for (let i = 0; i < split.length; i++) {
            const packageName = split[i];

            let node: Package;
            if (packages.length > 0) {
                node = packages.find((p) => packageName == p.name);
            }

            if (!node) {
                node = {
                    name: packageName,
                    childs: []
                } as Package;
                packages.push(node);
            }

            packages = node.childs;
        }
    }

    private flatternTreeModelsOnCascade(packages: Package[]): void {
        for (let i = 0; i < packages.length; i++) {
            let node = packages[i];
            while (node.childs && node.childs.length == 1) {
                const parentName: string = node.name;
                node = node.childs[0];
                node.name = parentName + "." + node.name;
            }
            packages[i] = node;

            if (node.childs && node.childs.length > 1) {
                this.flatternTreeModelsOnCascade(packages[i].childs);
            }
        }
    }

    private sortTreeModelOnCascade(packages: Package[]): void {
        packages.sort(this.treeModelComparator);
        packages.forEach(p => {
            this.sortTreeModelOnCascade(p.childs);
        });
    }

}
