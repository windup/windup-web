import {
    Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewEncapsulation, ViewChild, AfterViewInit, OnChanges,
    SimpleChanges
} from "@angular/core";
import {ITreeState, TreeComponent} from "angular-tree-component";

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

    treeNodesFiltered: TreeData[];

    @Input()
    set treeNodes(inputData:TreeData[]) {
        let sortFunc = (item1, item2) => {
            return item1.name.localeCompare(item2.name);
        };

        let crawlAndSortChildren = (inputData:TreeData[]) => {
            if (!inputData)
                return inputData;

            inputData.forEach(child => {
                child.children = crawlAndSortChildren(child.children)
            });

            return inputData.sort(sortFunc);
        };

        this.treeNodesFiltered = crawlAndSortChildren(inputData.filter(value => value.name != null && value.name != "").sort(sortFunc));
    };

    @Input()
    hasCheckboxes: boolean = true;

    _selectedNodes: TreeData[];

    @Input()
    set selectedNodes (newSelectedNodes: TreeData[]) {
        this._selectedNodes = newSelectedNodes;

        const selectedLeafNodeIds = {};

        this._selectedNodes.forEach(selectedNode => {
            selectedLeafNodeIds[selectedNode.id] = true;
        });

        this.treeState.selectedLeafNodeIds = selectedLeafNodeIds;
        this.treeComponent.treeModel.setState(this.treeState);

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
        useTriState: true,
        animateExpand: true,
        nodeHeight: 22,
    };

    public constructor() {
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

    selected(event) {
        this._selectedNodes.push(event.node.data);
        console.log("Selected: ", this._selectedNodes);
        this.selectedNodesChange.emit(this._selectedNodes);
    }

    deselected(event) {
        console.log("Deselected event: ", event);
        this._selectedNodes = this._selectedNodes.filter((item) => item.id != event.node.data.id);
        this.selectedNodesChange.emit(this._selectedNodes);
        console.log("De-Selected: ", this._selectedNodes);
    }
}

export interface TreeData {
    id: number,
    name: string,
    children: TreeData[],
    data: any,
    opened: boolean,
}
