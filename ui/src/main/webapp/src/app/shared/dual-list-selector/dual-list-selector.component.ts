import {
    Component, Input, ViewChild, Output, EventEmitter, OnDestroy
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
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { Package } from "../../generated/windup-services";

export interface TreeModelSelection {
    selected: TreeModel[],
    unselected: TreeModel[]
}

export interface PackageSelection {
    selected: Package[],
    unselected: Package[]
}

export interface RenamableNodeData extends RenamableNode {
    getData(): Package;
}

@Component({
    selector: 'wu-dual-list-selector',
    templateUrl: './dual-list-selector.component.html',
    styleUrls: ['./dual-list-selector.component.scss']
})
export class DualListSelectorComponent implements OnDestroy {

    static TREE_ROOT = "/"

    @ViewChild('tree')
    treeComponent: TreeComponent;

    @Output('onSelectionChange')
    onSelectionChange: EventEmitter<PackageSelection> = new EventEmitter();

    _packages: Package[];

    value: PackageSelection;

    checkedAll: boolean = true;

    treeModel: TreeModel;
    treeSettings: Ng2TreeSettings = {
        rootIsVisible: false,
        showCheckboxes: true
    } as Ng2TreeSettings;


    nodeEventSubject = new Subject<any>();

    subscriptions: Subscription[] = [];

    public constructor() {
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
            const treeModel: TreeModel = this.buildTreeModelTemplate();
            treeModel.children = this.toTreeModel(this._packages, null);
            this.treeModel = treeModel;
        }
    }

    // Tree events


    /**
     * When check a node then every children change its 'checked' value in cascade     
     */
    handleCheckedEvent(event: NodeCheckedEvent): void {
        if (event.node.id != DualListSelectorComponent.TREE_ROOT) {
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
        if (event.node.id != DualListSelectorComponent.TREE_ROOT) {
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
        this.setCheckedChildrenOnCascade(this.treeComponent.tree.children, value);
        this.nodeEventSubject.next(null);
    }

    /**
     * Updates value: Selected and Unselected nodes
     */
    updateValue(): void {
        if (this.treeComponent) {
            let treeModelSelection: TreeModelSelection = this.getCheckedNodes(this.treeComponent.tree.children);
            this.value = {
                selected: this.toPackage(treeModelSelection.selected) || [],
                unselected: this.toPackage(treeModelSelection.unselected) || []
            } as PackageSelection;
            this.onSelectionChange.emit(this.value);
        }
    }

    /**
     * Create a template of a TreeModel
     */
    private buildTreeModelTemplate(): TreeModel {
        return {
            id: DualListSelectorComponent.TREE_ROOT,
            value: DualListSelectorComponent.TREE_ROOT,
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
    private toTreeModel(packages: Package[], parent: Package): TreeModel[] {
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
        result.sort((a, b) => {
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
        });

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
            selected: [],
            unselected: []
        };

        for (let index = 0; index < tree.length; index++) {
            const node = tree[index];

            // If a node is checked, then children are checked too. No need to iterate children
            if (node.checked) {
                result.selected.push(node);
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
                        result.unselected.push(node);
                    } else {
                        //
                        if (this.atLeastOneChildIsChecked(node.children)) {
                            let childResult: TreeModelSelection = this.getCheckedNodes(node.children);
                            result.selected = result.selected.concat(childResult.selected);
                            result.unselected = result.unselected.concat(childResult.unselected);
                        } else {
                            result.unselected.push(node);
                        }
                    }
                } else {
                    result.unselected.push(node);
                }
            }
        }

        return result;
    }

}
