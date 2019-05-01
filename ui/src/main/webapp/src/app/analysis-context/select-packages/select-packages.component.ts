import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnDestroy
} from "@angular/core";
import { Package } from "../../generated/windup-services";
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";

export class PackageSelection {
    includePackages: Package[];
    excludePackages: Package[]
}

export class PackageFlatNode implements Package {
    id: number;
    name: string;
    fullName: string;
    countClasses: number;
    childs: Package[];
    level: number;
    known: boolean;

    expandable: boolean;
    flaternName: string;
}

@Component({
    selector: 'wu-select-packages',
    templateUrl: './select-packages.component.html',
    styleUrls: ['./select-packages.component.scss']
})
export class SelectPackagesComponent implements OnDestroy {

    @Output('onSelectionChange')
    onSelectionChange: EventEmitter<PackageSelection> = new EventEmitter();

    // @Input
    private _packages: Package[];

    // @Input value
    private _value: PackageSelection;

    @Input()
    icon: string = '';

    @Input()
    title: string = '';

    @Input()
    isApplicationPackages: boolean;

    // @Input()
    _defaultValue: boolean | PackageSelection;

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

    public constructor() {
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl<any>(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    }

    ngOnDestroy() {
        this.clearComponent();
    }

    @Input()
    set packages(packages: Package[]) {
        this._packages = packages;
        if (this._packages) {
            this.clearComponent();

            this.processPackagesBeforeSendingToDatasource(this._packages);
            this.dataSource.data = this._packages;

            this.loadTreeFromPreviousPackageSelection(null);
        }
    }

    @Input()
    set defaultValue(defaultValue: boolean | PackageSelection) {
        this._defaultValue = defaultValue;
        if (defaultValue != null && defaultValue !== undefined) {
            if (typeof defaultValue === "boolean") {
                this.loadTreeFromBooleanDefaultValue(defaultValue);
            } else {
                this.loadTreeFromPreviousPackageSelection(defaultValue);
            }
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

            this.parentNestedNodeMap.set(packages[i], parent);
            this.idNestedNodeMap.set(packages[i].id, packages[i]);

            this.processPackagesBeforeSendingToDatasource(packages[i].childs, packages[i]);
        }

        packages.sort(this.treeModelComparator);
    }

    private treeModelComparator(a: Package, b: Package): number {
        return a.name > b.name ? 1 : -1;
        // if (a.childs && a.childs.length > 0) {
        //     if (b.childs && b.childs.length > 0) {
        //         return a.name > b.name ? 1 : -1;
        //     } else {
        //         return 1;
        //     }
        // } else {
        //     if (b.childs && b.childs.length > 0) {
        //         return -1;
        //     } else {
        //         return a.name > b.name ? 1 : -1;
        //     }
        // }
    }

    private loadTreeFromBooleanDefaultValue(defaultValue: boolean): void {
        if (defaultValue) {
            for (let i = 0; i < this._packages.length; i++) {
                const node = this._packages[i];
                const flatNode = this.nestedNodeMap.get(node);
                this.itemSelectionToggle(flatNode, false);
            }
        }
        this.updateValue();
    }

    private loadTreeFromPreviousPackageSelection(packageSelection: PackageSelection): void {
        if (packageSelection) {            
            let includePackages: Package[];
            let excludePackages: Package[];

            // Loading previous data depends on Aplicationpackages/3rd party packages
            if (this.isApplicationPackages) {
                includePackages = packageSelection.includePackages.filter((element) => {
                    return !this.isAtLeastOneParentInTheList(packageSelection.includePackages, element.fullName);
                });
                excludePackages = packageSelection.excludePackages.filter((element) => {
                    return !this.isAtLeastOneParentInTheList(packageSelection.excludePackages, element.fullName);
                });
            } else {
                includePackages = packageSelection.includePackages.filter((element) => {
                    return !this.isAtLeastOneChildInTheList(packageSelection.includePackages, element.fullName);
                });
                excludePackages = packageSelection.excludePackages.filter((element) => {
                    return !this.isAtLeastOneChildInTheList(packageSelection.excludePackages, element.fullName);
                });
            }

            this.toggleNodesUsingDetachedPackages(includePackages, false);
            this.uncheckNodesUsingDetachedPackages(excludePackages, false);
            this.updateValue();
        }
    }

    private toggleNodesUsingDetachedPackages(packages: Package[], updateValue: boolean) {
        if (packages) {
            packages.forEach((node) => {
                const packageNode: Package = this.idNestedNodeMap.get(node.id);
                const packageFlatNode: PackageFlatNode = this.nestedNodeMap.get(packageNode);
                if (packageFlatNode) {
                    this.itemSelectionToggle(packageFlatNode, updateValue);
                }
            });
        }
    }

    private uncheckNodesUsingDetachedPackages(packages: Package[], updateValue: boolean) {
        if (packages) {
            packages.forEach((node) => {
                const packageNode: Package = this.idNestedNodeMap.get(node.id);
                const packageFlatNode: PackageFlatNode = this.nestedNodeMap.get(packageNode);
                if (packageFlatNode && this.checklistSelection.isSelected(packageFlatNode)) {
                    this.itemSelectionToggle(packageFlatNode, updateValue);
                }
            });
        }
    }

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

        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);

        return flatNode;
    }

    /** Toggle a leaf item selection. Check all the parents to see if they changed */
    leafItemSelectionToggle(node: PackageFlatNode, updateValue: boolean = true): void {
        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);

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

        // Update value
        if (updateValue) {
            this.updateValue();
        }
    }


    // Component events

    /**
    * Change tree checks and fire event to update value
    */
    onCheckedAllChange(value: boolean): void {
        if (!this._packages) {
            return;
        }

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
        this._value = this.getCheckedNodes(this._packages);

        // Emit event
        this.onSelectionChange.emit(this._value);
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

    // Utils

    private isAtLeastOneParentInTheList(packages: Package[], fullName: String): boolean {
        const parentPackageName = fullName.substring(0, fullName.lastIndexOf("."));
        if (!parentPackageName) {
            return false;
        }
        if (packages.some(element => element.fullName == parentPackageName)) {
            return true;
        }
        return this.isAtLeastOneParentInTheList(packages, parentPackageName);
    }

    private isAtLeastOneChildInTheList(packages: Package[], fullName: string): boolean {
        return packages.some(element => element.fullName.startsWith(fullName + "."));
    }
}
