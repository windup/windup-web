import {
    Component, Input, ViewChild, Output, EventEmitter
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

export interface TreeData {
    id: number,
    name: string,
    childs: TreeData[]
}

export interface TreeModelSelection {
    selected: TreeModel[],
    unselected: TreeModel[]
}

export interface TreeDataSelection {
    selected: TreeData[],
    unselected: TreeData[]
}

export interface RenamableNodeData extends RenamableNode {
    getData(): any;
}

@Component({
    selector: 'wu-dual-list-selector',
    templateUrl: './dual-list-selector.component.html',
    styleUrls: ['./dual-list-selector.component.scss']
})
export class DualListSelectorComponent {

    @ViewChild('tree')
    treeComponent: TreeComponent;

    @Output('onSelectionChange')
    onSelectionChange: EventEmitter<TreeDataSelection> = new EventEmitter();

    _treeData: TreeData[];

    value: TreeDataSelection;

    treeModel: TreeModel;
    treeSettings: Ng2TreeSettings = {
        rootIsVisible: false,
        showCheckboxes: true
    } as Ng2TreeSettings;

    public constructor() {

    }

    get treeData(): TreeData[] {
        return this._treeData;
    }

    @Input()
    set treeData(treeData: TreeData[]) {
        this._treeData = treeData;
        if (this._treeData && this._treeData.length > 0) {
            const treeModel: TreeModel = this.buildTreeModelTemplate();
            treeModel.children = this.toTreeModel(this._treeData);;
            this.treeModel = treeModel;
        }
    }

    // Tree events


    /**
     * When check a node then every children change its 'checked' value in cascade     
     */
    handleCheckedEvent(event: NodeCheckedEvent) {
        event.node.checked = true;
        if (event.node.hasChildren()) {
            this.setCheckedValueOnCascade(event.node.children, true);
        }
        this.updateValue();
    }

    /**
     * When uncheck a node then every children change its 'checked' value in cascade     
     */
    handleUncheckedEvent(event: NodeUncheckedEvent) {
        event.node.checked = false;
        if (event.node.hasChildren()) {
            this.setCheckedValueOnCascade(event.node.children, false);
        }
        this.updateValue();
    }


    //


    updateValue(): void {
        if (this.treeComponent) {
            let treeModelSelection: TreeModelSelection = this.getCheckedNodes(this.treeComponent.tree.children);
            this.value = {
                selected: this.toTreeData(treeModelSelection.selected),
                unselected: this.toTreeData(treeModelSelection.unselected) || []
            } as TreeDataSelection;
            this.onSelectionChange.emit(this.value);
        }
    }

    /**
     * Create a template of a TreeModel
     */
    private buildTreeModelTemplate(): TreeModel {
        return {
            id: '/',
            value: '/',
            settings: {
                checked: true,
                isCollapsedOnInit: false,
                static: true,
                cssClasses: {
                    expanded: 'fa fa-angle-down',
                    collapsed: 'fa fa-angle-right',
                    empty: 'fa fa-caret-right disabled',
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
    private toTreeModel(treeData: TreeData[]): TreeModel[] {
        if (!treeData || treeData.length < 1) {
            return null;
        }

        const treeModel: TreeModel[] = [];
        for (let index = 0; index < treeData.length; index++) {
            const treeDataNode = treeData[index];
            treeModel.push({
                id: treeDataNode.id,

                value: <RenamableNode>{
                    data: treeDataNode,
                    name: treeDataNode.name,
                    setName(name: string): void {
                        this.name = name;
                    },
                    toString(): string {
                        return this.name;
                    },
                    getData() {
                        return this.data;
                    }
                } as RenamableNodeData,

                // Save data
                data: treeDataNode,

                settings: {
                    isCollapsedOnInit: true
                },
                children: this.toTreeModel(treeDataNode.childs)
            });
        }

        return treeModel;
    }

    /**
     * Maps a TreeModel[] to its original TreeData form
     */
    private toTreeData(treeModel: TreeModel[]): any[] {
        if (!treeModel || treeModel.length < 1) {
            return null;
        }

        const result: TreeData[] = [];
        for (let index = 0; index < treeModel.length; index++) {
            const treeNode = treeModel[index];
            result.push((<RenamableNodeData>treeNode.value).getData());
        }

        return result;
    }

    /**
     * Set checked value of every node and their children in cascade
     */
    private setCheckedValueOnCascade(tree: Tree[], checked: boolean): void {
        for (let index = 0; index < tree.length; index++) {
            const treeNode = tree[index];
            treeNode.checked = checked;
            if (treeNode.hasChildren()) {
                this.setCheckedValueOnCascade(treeNode.children, checked);
            }
        }
    }

    /**
     * @returns A list of nodes with 'checked' value equ
     */
    private getCheckedNodes(tree: Tree[]): TreeModelSelection {
        let result: TreeModelSelection = {
            selected: [],
            unselected: []
        };

        for (let index = 0; index < tree.length; index++) {
            const node = tree[index];

            if (node.checked) {
                result.selected.push(node);
            } else {
                result.unselected.push(node);
            }

            if (node.hasChildren()) {
                let childResult: TreeModelSelection = this.getCheckedNodes(node.children);
                result.selected = result.selected.concat(childResult.selected);
                result.unselected = result.unselected.concat(childResult.unselected);
            }
        }

        return result;
    }

}
