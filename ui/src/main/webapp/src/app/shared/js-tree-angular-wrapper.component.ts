import {
    Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, AfterViewInit,
    SimpleChanges, ApplicationRef
} from "@angular/core";
import {ITreeState, TreeComponent, TreeNode} from "angular-tree-component";

/**
 * Wrapper for angular tree from: https://angular2-tree.readme.io/
 */
@Component({
    templateUrl: './js-tree-angular-wrapper.component.html',
    selector: 'wu-js-tree-wrapper',
    host: { 'style': 'display: block; overflow: auto;' }
})
export class JsTreeAngularWrapperComponent implements AfterViewInit, OnInit, OnDestroy {

    @ViewChild('tree')
    treeComponent: TreeComponent;

    treeState: ITreeState = {
        selectedNodeIds: {},
        expandedNodeIds: {},
        hiddenNodeIds: {},
        activeNodeIds: {}
    };

    treeNodesFiltered: TreeDataExtended[];

    @Input()
    set treeNodes(inputData:TreeData[]) {
        //console.log("Tree nodes set:", inputData);
        // Sort alphabetically
        let sortFunc = (item1, item2) => {
            return item1.name.localeCompare(item2.name);
        };

        // Sort all children, and also attach the parent node
        let crawlAndSortChildren = (parent:TreeDataExtended, inputData:TreeData[]):TreeDataExtended[] => {
            if (!inputData)
                return <TreeDataExtended[]>inputData;

            inputData.forEach(child => {
                let childExtended = <TreeDataExtended>child;
                childExtended.parent = parent;
                childExtended.hasChildren = !!(child.children && child.children.length);
                child.children = crawlAndSortChildren(childExtended, child.children)
            });

            return inputData.sort(sortFunc).map(treeData => <TreeDataExtended>treeData);
        };

        // Filter out any empty root nodes, sort, and convert for display purposes
        this.treeNodesFiltered = crawlAndSortChildren(null, inputData.filter(value => value.name != null && value.name != "").sort(sortFunc));

        // Make sure to reset selections so that parent and child relationships are right
        this.selectedNodes = this._selectedNodes;
    };

    @Input()
    hasCheckboxes: boolean = true;

    _selectedNodes: TreeDataExtended[];

    @Input()
    set selectedNodes (newSelectedNodes: TreeData[]) {
        this._selectedNodes = <TreeDataExtended[]>newSelectedNodes;
        //console.log("Reselecting nodes: ", this.treeState.selectedLeafNodeIds);

        const selectedLeafNodeIds = {};

        if (this._selectedNodes) {
            this._selectedNodes.forEach(selectedNode => {
                selectedLeafNodeIds[selectedNode.id] = true;

                this.addParentSelections(selectedLeafNodeIds, selectedNode.id);
                this.addChildSelections(selectedLeafNodeIds, selectedNode.id);
            });
        }

        this.treeState.selectedLeafNodeIds = selectedLeafNodeIds;
        this.treeComponent.treeModel.setState(this.treeState);
        //console.log("Reselected nodes: ", selectedLeafNodeIds);

    }

    get selectedNodes (): TreeData[] {
        return this._selectedNodes;
    }

    @Output()
    selectedNodesChange: EventEmitter<TreeData[]> = new EventEmitter<TreeData[]>();

    @Output()
    nodeClicked: EventEmitter<TreeData> = new EventEmitter<TreeData>();

    options = {
        displayField: 'name',
        useCheckbox: true,
        useTriState: false,
        animateExpand: true,
        nodeHeight: 22,
        hasChildrenField: 'hasChildren',
        childrenField: 'childNodes',
        getChildren: (node:TreeNode) => node.data.children
    };

    public constructor(public applicationRef:ApplicationRef) {
        // setInterval(() => {
        //     console.log("Tree data: ", this.treeNodes);
        // }, 10000);
    }

    ngAfterViewInit() {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    private findNode(originalNodes:TreeDataExtended[], nodeId:number):TreeDataExtended {
        let result = null;

        if (!originalNodes)
            return null;

        originalNodes.forEach(originalNode => {
            if (result)
                return;

            if (originalNode.id == nodeId) {
                result = originalNode;
                return;
            }

            result = this.findNode(<TreeDataExtended[]>originalNode.children, nodeId);
        });

        return result;
    }

    private addChildSelections(selectedLeafNodeIds:{}, nodeId:number) {
        let originalNode = this.findNode(this.treeNodesFiltered, nodeId);
        if (!originalNode)
            return;


        let selectorFunction = (node:TreeDataExtended) => {
            selectedLeafNodeIds[node.id] = true;

            if (!node.hasChildren)
                return;

            node.children.forEach(childNode => {
                selectorFunction(<TreeDataExtended>childNode);
            });
        };
        selectorFunction(originalNode);
    }

    private addParentSelections(selectedLeafNodeIds:{}, nodeId:number) {
        let originalNode = this.findNode(this.treeNodesFiltered, nodeId);
        //console.log("Original node: ", originalNode);

        while (originalNode) {
            selectedLeafNodeIds[originalNode.id] = true;
            originalNode = originalNode.parent;
        }

        //console.log("Add parent set them to: ", selectedLeafNodeIds);
    }

    selected(event) {
        this._selectedNodes.push(event.node.data);

        // This just triggers the setter method to be called
        this.selectedNodes = this._selectedNodes;
        //console.log("Selected: ", this._selectedNodes);
        this.selectedNodes = this._selectedNodes;
        this.selectedNodesChange.emit(this._selectedNodes);
    }

    deselected(event) {
        //console.log("Deselected event: ", event);
        let nodesToDeselect = [];
        let crawlNode = (data:TreeData) => {
            if (!data)
                return;

            nodesToDeselect.push(data.id);

            data.children.forEach((child) => {
                crawlNode(child);
            });
        };
        crawlNode(event.node.data);
        //console.log("Should deselect: ", nodesToDeselect);

        let indexOfExistingNode = this._selectedNodes.findIndex(selectedNode => {
            console.log("this selected node:", selectedNode, event);
            return selectedNode.id == event.node.id;
        });

        if (indexOfExistingNode == -1)
        {
            window.alert("This cannot be unselected until all parent nodes are unselected!");
        } else
        {
            //console.log("Current: ", this._selectedNodes);
            this._selectedNodes = this._selectedNodes.filter((item) => {
                let index = nodesToDeselect.indexOf(item.id);
                //console.log("Item: ", item, index);
                return index == -1;
            });
            //console.log("Then: ", this._selectedNodes);
        }

        // This just triggers the setter method to be called
        this.selectedNodes = this._selectedNodes;
        this.selectedNodesChange.emit(this._selectedNodes);
        //console.log("De-Selected: ", this._selectedNodes);
    }


}

export interface TreeDataExtended extends TreeData {
    hasChildren: boolean,
    parent: TreeDataExtended,
}

export interface TreeData {
    id: number,
    name: string,
    children: TreeData[],
    data: any,
    opened: boolean,
}
