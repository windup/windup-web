import {
    Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewEncapsulation
} from "@angular/core";

/**
 * Wrapper for angular tree from: https://angular2-tree.readme.io/
 */
@Component({
    templateUrl: './js-tree-angular-wrapper.component.html',
    selector: 'wu-js-tree-wrapper',
    host: { 'style': 'display: block; overflow: auto;' }
})
export class JsTreeAngularWrapperComponent implements OnInit, OnDestroy {

    treeNodesFiltered: TreeData[];

    @Input()
    set treeNodes(inputData:TreeData[]) {
        this.treeNodesFiltered = inputData.filter(value => value.name != null && value.name != "");
        console.log("Tree nodes filtered: ", this.treeNodesFiltered);
    };

    @Input()
    hasCheckboxes: boolean = true;

    @Input()
    selectedNodes: TreeData[];

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
    };

    public constructor() {
        // setInterval(() => {
        //     console.log("Tree data: ", this.treeNodes);
        // }, 10000);
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    selected(event) {
        this.selectedNodes.push(event.node.data);
        console.log("Selected: ", this.selectedNodes);
    }

    deselected(event) {
        console.log("Deselected event: ", event);
        this.selectedNodes = this.selectedNodes.filter((item) => item.id != event.node.data.id);
        console.log("De-Selected: ", this.selectedNodes);
    }
}

export interface TreeData {
    id: number,
    name: string,
    children: TreeData[],
    data: any,
    opened: boolean,
}
