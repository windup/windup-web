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

    static TREE_ROOT = '/';

    @ViewChild('packageTree')
    packageTreeComponent: TreeComponent;

    @ViewChild('excludePackageTree')
    excludePackageTreeComponent: TreeComponent;

    @Output('onSelectionChange')
    onSelectionChange: EventEmitter<PackageSelection> = new EventEmitter();

    @Output()
    onViewThirdPackagesChange: EventEmitter<boolean> = new EventEmitter();

    // @Input
    private _packages: Package[];

    @Input()
    loading: boolean;

    viewThirdPackages: boolean;

    // NgForm value
    value: PackageSelection;

    checkedAll: boolean = false;
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

        // Avoid multiple updates when check or uncheck due to multiples
        // handleCheckedEvent() or handleUncheckedEvent()
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
        if (this._packages) {
            this.initializeTreeNodes();
        }
    }


    // ControlValueAccessor methods


    /**
     * 
     * Called to write data from the model to the view
     */
    writeValue(obj: any): void {
        if (obj) {
            this.value = obj;
            this.initializeTreeNodes();
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
            this.uncheckParentsOnCascade(event.node);
            this.nodeEventSubject.next(event);
        }

        // Uncheck principal check
        this.checkedAll = false;
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
        this.setCheckedChildrenOnCascade(this.packageTreeComponent.tree.children, value);
        this.nodeEventSubject.next(null);
    }



    /**
     * Config the tree the first time or whenever 'NgModel' or '@Input() packages' change 
     */
    initializeTreeNodes(): void {
        if (this._packages && this._packages.length > 0) {
            this.packageTreeModel.children = this.toTreeModel(this.value, this._packages);

            // If value is passed from outside, then verify if it has Third party packages
            if (this.value) {
                if (this.viewThirdPackages == undefined) {
                    for (let i = 0; i < this.value.includePackages.length; i++) {
                        if (this.value.includePackages[i].known) {
                            this.viewThirdPackages = true;
                            break;
                        }
                    }
                }
            }
        } else {
            this.packageTreeModel.children = [];
        }

        // 'TreeModel.children = []' should be enought but
        // this is needed for refresh the DOM. This should be here until
        // problem is solved in future versions
        if (this.packageTreeComponent) {
            this.packageTreeComponent.getController().setChildren(this.packageTreeModel.children);
        }

        this.updateValue();
    }

    /**
     * Updates 'NgModel' value when select or unselect events occur
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

            // 'TreeModel.children = []' should be enought but
            // this is needed for refresh the DOM. This should be here until
            // problem is solved in future versions
            if (this.excludePackageTreeComponent) {
                this.excludePackageTreeComponent.getController().setChildren(excludeTreeModel.children);
            }


            // Change Model (NgForm)
            this._onChange(this.value);

            // Emit event
            this.onSelectionChange.emit(this.value);
        }
    }


    // Core


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
    private toTreeModel(currentValue: PackageSelection, packages: Package[], packageParent: Package = null, treeModelParent: TreeModel = null): TreeModel[] {
        if (!packages || packages.length < 1) {
            return null;
        }

        const result: TreeModel[] = [];
        for (let i = 0; i < packages.length; i++) {
            let element: Package = packages[i];

            // Flatter if possible
            let wasFlattered = false;
            if (element.childs && element.childs.length == 1) {
                while (element.childs && element.childs.length == 1) {
                    element = element.childs[0];
                }
                wasFlattered = true;
            }


            // Load previous values from database
            let checked: boolean;
            if (currentValue &&
                currentValue.includePackages &&
                currentValue.excludePackages &&
                (currentValue.includePackages.length + currentValue.excludePackages.length) > 0
            ) {
                checked = false;
                if (treeModelParent && treeModelParent.settings.checked) {
                    checked = true;
                } else {
                    if (this.containsNodeWithFullName(currentValue.includePackages, element.fullName)) {
                        checked = true;
                    }
                }
            } else {
                checked = true;
            }


            if (treeModelParent && !element.known) {
                let tree = treeModelParent;
                while (tree) {
                    tree.settings.templates = {
                        node: '<i class="fa fa-folder"></i>',
                        leaf: '<i class="fa fa-folder"></i>'
                    };
                    tree = tree.parent;
                }
            }

            // Map to TreeModel
            const treeModelNode: TreeModel = {
                id: element.id,
                value: <RenamableNode>{
                    name: element.name,
                    data: element,
                    isFlattered: wasFlattered,
                    fullName: element.fullName,
                    parentFullName: packageParent ? packageParent.fullName : null,
                    parent: treeModelParent,
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
                    checked: checked,
                    isCollapsedOnInit: true,
                    templates: {
                        node: !element.known ? '<i class="fa fa-folder"></i>' : '<i class="fa fa-folder-o"></i>',
                        leaf: !element.known ? '<i class="fa fa-folder"></i>' : '<i class="fa fa-folder-o"></i>'
                    }
                }
            };
            treeModelNode.children = this.toTreeModel(currentValue, element.childs, element, treeModelNode);

            // Push node to result
            result.push(treeModelNode);
        }

        // Order alphabetically
        result.sort(this.treeModelComparator);

        return result;
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
                        if (this.atLeastOneChildIsCheckedOnCascade(node.children)) {
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

        // if (a.children && a.children.length > 0) {
        //     if (b.children && b.children.length > 0) {
        //         if (typeof a.value === 'string' && typeof b.value === 'string') {
        //             return a.value > b.value ? 1 : -1;
        //         } else {
        //             const aValue = <RenamableNodeData>a.value;
        //             const bValue = <RenamableNodeData>b.value;
        //             if (aValue.getData().known && bValue.getData().known) {
        //                 return a.value > b.value ? -1 : 1;
        //             } else if (aValue.getData().known) {
        //                 return 1;
        //             } else {
        //                 return -1;
        //             }
        //         }
        //     } else {
        //         return 1;
        //     }
        // } else {
        //     if (b.children && b.children.length > 0) {
        //         return -1;
        //     } else {
        //         if (typeof a.value === 'string' && typeof b.value === 'string') {
        //             return a.value > b.value ? 1 : -1;
        //         } else {
        //             const aValue = <RenamableNodeData>a.value;
        //             const bValue = <RenamableNodeData>b.value;
        //             if (aValue.getData().known && bValue.getData().known) {
        //                 return a.value > b.value ? -1 : 1;
        //             } else if (aValue.getData().known) {
        //                 return 1;
        //             } else {
        //                 return -1;
        //             }
        //         }
        //     }
        // }
    }


    // Utils


    /**
     * Create nodes on tree using packageFullName
     */
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
     * Checks if the list of packages contain one package with 'fullName' node
     */
    private containsNodeWithFullName(packages: Package[], fullName: string): boolean {
        if (packages) {
            for (let i = 0; i < packages.length; i++) {
                const element = packages[i];
                if (element.fullName == fullName) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Uncheck parents in cascade     
     */
    private uncheckParentsOnCascade(tree: Tree): void {
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

    private atLeastOneChildIsCheckedOnCascade(tree: Tree[]): boolean {
        let result: boolean = false;
        for (let index = 0; index < tree.length; index++) {
            const treeNode = tree[index];
            if (treeNode.checked == true) {
                result = true;
            }
            if (treeNode.hasChildren()) {
                result = this.atLeastOneChildIsCheckedOnCascade(treeNode.children);
            }

            if (result == true) {
                break;
            }
        }
        return result;
    }

}
