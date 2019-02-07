import {
    Component,
    Input,
    Output,
    ViewChild,
    EventEmitter,
    OnDestroy,
    forwardRef
} from "@angular/core";
import {
    TreeModel,
    Ng2TreeSettings,
    NodeMenuItemAction,
    TreeComponent,
    Tree,
    NodeCheckedEvent,
    NodeUncheckedEvent,
    RenamableNode
} from "ng2-tree";
import {
    NG_VALUE_ACCESSOR,
    NG_VALIDATORS,
    ControlValueAccessor,
    Validator,
    AbstractControl,
    ValidationErrors
} from "@angular/forms";
import { Package } from "../generated/windup-services";
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';

export interface TreeModelSelection {
    includeModels: TreeModel[],
    excludeModels: TreeModel[]
}

export interface PackageSelection {
    includePackages: Package[],
    excludePackages: Package[]
}

export interface RenamableNodeData extends RenamableNode {
    getData(): Package;
}

export enum ExcludePackagesViewSelector {
    LIST,
    TREE
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
export class SelectPackagesComponent implements OnDestroy, ControlValueAccessor, Validator {

    static TREE_ROOT = '/'

    @ViewChild('packageTree')
    packageTreeComponent: TreeComponent;

    @ViewChild('excludePackageTree')
    excludePackageTreeComponent: TreeComponent;

    @Output('onSelectionChange')
    onSelectionChange: EventEmitter<PackageSelection> = new EventEmitter();

    private _packages: Package[];

    value: PackageSelection;

    checkedAll: boolean = true;
    excludePackageViewSelection: ExcludePackagesViewSelector = ExcludePackagesViewSelector.LIST;

    packageTreeModel: TreeModel;
    packageTreeSettings: Ng2TreeSettings = {
        rootIsVisible: false,
        showCheckboxes: true
    } as Ng2TreeSettings;

    excludePackageTreeModel: TreeModel
    excludePackageTreeSettings: Ng2TreeSettings = {
        rootIsVisible: false,
        showCheckboxes: false
    } as Ng2TreeSettings;

    private nodeEventSubject = new Subject<any>();
    private subscriptions: Subscription[] = [];

    private _onChange = (_: any) => { };
    private _onTouched = () => { };

    public constructor() {
        this.packageTreeModel = this.buildTreeModelTemplate();

        let treeModelTemplate = this.buildTreeModelTemplate();
        treeModelTemplate.settings.checked = null;
        this.excludePackageTreeModel = treeModelTemplate;

        // Avoid multiple updates when check or uncheck due to handleCheckedEvent() or handleUncheckedEvent()
        this.subscriptions.push(
            this.nodeEventSubject
                .debounceTime(100)
                .subscribe(() => {
                    this.updateValue();
                })
        );
    }

    ngOnDestroy() {
        this.packageTreeModel.children = [];
        this.excludePackageTreeModel.children = [];
        this.subscriptions.forEach(
            (subscription) => subscription.unsubscribe()
        );
    }

    get packages(): Package[] {
        return this._packages;
    }

    @Input()
    set packages(packages: Package[]) {
        this._packages = packages;
        if (this._packages && this._packages.length > 0) {
            this.packageTreeModel.children = this.toTreeModel(this._packages);
        }
    }


    // ControlValueAccessor methods


    /**
     * 
     * Called to write data from the model to the view
     */
    writeValue(obj: any): void {
        if (obj) {
            if (this._packages && this._packages.length > 0) {
                let treeModel: TreeModel;
                if (this.packageTreeModel) {
                    treeModel = this.packageTreeModel
                } else {
                    treeModel = this.buildTreeModelTemplate();
                }

                // load nodes
                treeModel.children = null;

                if (!this.packageTreeModel) {
                    this.packageTreeModel = treeModel;
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
        return (this.value && this.value.includePackages && this.value.includePackages.length > 0) ? null : {
            required: {
                valid: false
            }
        };
    };


    // Tree events


    /**
     * When check a node then every children change its 'checked' value in cascade     
     */
    handleCheckedEvent(event: NodeCheckedEvent): void {
        if (event.node.id != SelectPackagesComponent.TREE_ROOT) {
            event.node.checked = true;
            if (event.node.hasChildren() && event.node.isNodeCollapsed()) {
                this.setCheckedChildrenOnCascade(event.node.children, true);
            }
            this.nodeEventSubject.next(event);
        }
    }

    /**
     * When uncheck a node then every children change its 'checked' value in cascade     
     */
    handleUncheckedEvent(event: NodeUncheckedEvent): void {
        if (event.node.id != SelectPackagesComponent.TREE_ROOT) {
            event.node.checked = false;
            if (event.node.hasChildren() && event.node.isNodeCollapsed()) {
                this.setCheckedChildrenOnCascade(event.node.children, false);
            }
            this.uncheckParentOnCascade(event.node);
            this.nodeEventSubject.next(event);
        }

        // Uncheck principal check
        this.checkedAll = false;
    }


    //

    /**
     * Change tree checks and fire event to update value
     */
    onCheckedAllChange(value: boolean): void {
        this.setCheckedChildrenOnCascade(this.packageTreeComponent.tree.children, value);
        this.nodeEventSubject.next(null);
    }

    /**
     * Updates value: Selected and Unselected nodes
     */
    updateValue(): void {
        if (this.packageTreeComponent) {
            let treeModelSelection: TreeModelSelection = this.getCheckedNodes(this.packageTreeComponent.tree.children);
            this.value = {
                includePackages: this.toPackage(treeModelSelection.includeModels) || [],
                excludePackages: this.toPackage(treeModelSelection.excludeModels) || []
            } as PackageSelection;


            // Create excluded tree
            const excludeTreeModel: TreeModel = this.buildTreeModelTemplate();
            for (let i = 0; i < this.value.excludePackages.length; i++) {
                const node: Package = this.value.excludePackages[i];
                this.createNodesFromPackageFullName(node.fullName, excludeTreeModel);
            }
            this.flatternTreeModelsOnCascade(excludeTreeModel.children);
            this.sortTreeModelOnCascade(excludeTreeModel);

            this.excludePackageTreeModel.children = excludeTreeModel.children;
            if (this.excludePackageTreeComponent) {
                // This is need for refresh the DOM
                this.excludePackageTreeComponent.getController().setChildren(excludeTreeModel.children);
            }


            // Change Model (NgForm)
            this._onChange(this.value);

            // Emit event
            this.onSelectionChange.emit(this.value);
        }
    }

    private createNodesFromPackageFullName(packageFullName: string, tree: TreeModel): void {
        const split: string[] = packageFullName.split('.');
        for (let i = 0; i < split.length; i++) {
            const packageName = split[i];

            let node: TreeModel;
            if (tree.children) {
                for (let j = 0; j < tree.children.length; j++) {
                    if (packageName == tree.children[j].value) {
                        node = tree.children[j];
                        break;
                    }
                }
            } else {
                tree.children = [];
            }

            if (!node) {
                node = {
                    value: packageName
                } as TreeModel;
                tree.children.push(node);
            }

            tree = node;
        }
    }

    private flatternTreeModelsOnCascade(treeModel: TreeModel[]): void {
        if (treeModel) {
            for (let i = 0; i < treeModel.length; i++) {
                let node = treeModel[i];
                while (node.children && node.children.length == 1) {
                    const parentName: string = <string>node.value;
                    node = node.children[0];
                    node.value = parentName + "." + node.value;
                }
                treeModel[i] = node;

                if (node.children && node.children.length > 1) {
                    this.flatternTreeModelsOnCascade(treeModel[i].children);
                }
            }
        }
    }

    private sortTreeModelOnCascade(tree: TreeModel): void {
        if (tree.children && tree.children.length > 0) {
            tree.children.sort(this.treeModelComparator);
            tree.children.forEach(child => {
                this.sortTreeModelOnCascade(child);
            });
        }
    }

    /**
     * Create a template of a TreeModel
     */
    private buildTreeModelTemplate(): TreeModel {
        return {
            id: SelectPackagesComponent.TREE_ROOT,
            value: SelectPackagesComponent.TREE_ROOT,
            settings: {
                checked: true,
                isCollapsedOnInit: false,
                static: true,
                cssClasses: {
                    expanded: 'fa fa-angle-down cursor-pointer',
                    collapsed: 'fa fa-angle-right cursor-pointer',
                    empty: 'fa fa-caret-right disabled cursor-pointer',
                    leaf: 'fa'
                },
                templates: {
                    node: '<i class="fa fa-folder"></i>',
                    leaf: '<i class="fa fa-folder"></i>'
                },
                menuItems: [
                    {
                        action: NodeMenuItemAction.Custom,
                        name: 'Select',
                        cssClass: 'fa fa-arrow-right'
                    }
                ]
            }
        };
    }

    /**
     * Maps a TreeData[] to TreeModel[]
     */
    private toTreeModel(packages: Package[], parent: Package = null): TreeModel[] {
        if (!packages || packages.length < 1) {
            return null;
        }

        const result: TreeModel[] = [];
        for (let index = 0; index < packages.length; index++) {
            let element: Package = packages[index];

            // Flatter if possible
            let wasFlattered = false;
            if (element.childs && element.childs.length == 1) {
                while (element.childs && element.childs.length == 1) {
                    element = element.childs[0];
                }
                wasFlattered = true;
            }

            // Map to TreeModel
            const treeModelNode: TreeModel = {
                id: element.id,
                value: <RenamableNode>{
                    name: element.name,
                    data: element,
                    isFlattered: wasFlattered,
                    fullName: element.fullName,
                    parentFullName: parent ? parent.fullName : null,
                    setName(name: string): void {
                        this.name = name;
                    },
                    toString(): string {
                        if (this.isFlattered) {
                            // Flatter package name
                            if (this.parentFullName) {
                                return this.fullName.replace(this.parentFullName + '.', '');
                            } else {
                                return this.fullName;
                            }
                        } else {
                            return this.name;
                        }
                    },
                    getData(): Package {
                        return this.data;
                    }
                } as RenamableNodeData,
                settings: {
                    isCollapsedOnInit: true
                }
            };
            treeModelNode.children = this.toTreeModel(element.childs, element);

            // Push node to result
            result.push(treeModelNode);
        }

        // Order alphabetically
        result.sort(this.treeModelComparator);

        return result;
    }

    private treeModelComparator(a: TreeModel, b: TreeModel): number {
        if (a.children && a.children.length > 0) {
            if (b.children && b.children.length > 0) {
                return a.value > b.value ? 1 : -1;
            } else {
                return 1;
            }
        } else {
            if (b.children && b.children.length > 0) {
                return -1;
            } else {
                return a.value > b.value ? 1 : -1;
            }
        }
    }

    /**
     * Maps a TreeModel[] to its original Package form
     */
    private toPackage(treeModel: TreeModel[]): Package[] {
        if (!treeModel || treeModel.length < 1) {
            return null;
        }

        const result: Package[] = [];
        for (let index = 0; index < treeModel.length; index++) {
            const treeNode = treeModel[index];
            result.push((<RenamableNodeData>treeNode.value).getData());
        }

        return result;
    }

    /**
     * Uncheck parents in cascade     
     */
    private uncheckParentOnCascade(tree: Tree): void {
        while (tree.parent) {
            tree.parent.checked = false;
            tree = tree.parent;
        }
    }

    /**
     * Set checked value of every node and their children in cascade
     */
    private setCheckedChildrenOnCascade(tree: Tree[], checked: boolean): void {
        for (let index = 0; index < tree.length; index++) {
            const treeNode = tree[index];
            treeNode.checked = checked;
            if (treeNode.hasChildren()) {
                this.setCheckedChildrenOnCascade(treeNode.children, checked);
            }
        }
    }

    private atLeastOneChildIsChecked(tree: Tree[]): boolean {
        let result: boolean = false;
        for (let index = 0; index < tree.length; index++) {
            const treeNode = tree[index];
            if (treeNode.checked == true) {
                result = true;
            }
            if (treeNode.hasChildren()) {
                result = this.atLeastOneChildIsChecked(treeNode.children);
            }

            if (result == true) {
                break;
            }
        }

        return result;
    }

    /**
     * @returns A list of selected and unselected nodes
     */
    private getCheckedNodes(tree: Tree[]): TreeModelSelection {
        let result: TreeModelSelection = {
            includeModels: [],
            excludeModels: []
        };

        for (let index = 0; index < tree.length; index++) {
            const node = tree[index];

            // If a node is checked, then children are checked too. No need to iterate children
            if (node.checked) {
                result.includeModels.push(node);
            } else {
                if (node.hasChildren()) {

                    let allFirstChildrenAreChecked: boolean = true;
                    for (let index = 0; index < node.children.length; index++) {
                        const element = node.children[index];
                        if (element.checked == false) {
                            allFirstChildrenAreChecked = false;
                            break;
                        }
                    }

                    // If all first children are checked, then no need to iterate children
                    if (allFirstChildrenAreChecked) {
                        result.excludeModels.push(node);
                    } else {
                        //
                        if (this.atLeastOneChildIsChecked(node.children)) {
                            let childResult: TreeModelSelection = this.getCheckedNodes(node.children);
                            result.includeModels = result.includeModels.concat(childResult.includeModels);
                            result.excludeModels = result.excludeModels.concat(childResult.excludeModels);
                        } else {
                            result.excludeModels.push(node);
                        }
                    }
                } else {
                    result.excludeModels.push(node);
                }
            }
        }

        return result;
    }

}
