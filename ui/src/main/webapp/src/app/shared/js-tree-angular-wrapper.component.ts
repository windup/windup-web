import {
    Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewEncapsulation
} from "@angular/core";

/**
 * Wrapper for angular tree from: https://angular2-tree.readme.io/
 */
@Component({
    templateUrl: './js-tree-angular-wrapper.component.html',
    selector: 'wu-js-tree-wrapper',
    //host: { 'style': 'display: block; overflow: auto;' }
})
export class JsTreeAngularWrapperComponent implements OnInit, OnDestroy {
    @Input()
    treeNodes: TreeData[];

    @Input()
    hasCheckboxes: boolean = true;

    treeNodesMap: {[id: string]: TreeData} = {};

    @Input()
    selectedNodes: TreeData[];

    @Output()
    selectedNodesChange: EventEmitter<TreeData[]> = new EventEmitter<TreeData[]>();

    @Output()
    nodeClicked: EventEmitter<TreeData> = new EventEmitter<TreeData>();

    options = {
        displayField: 'name',
        isExpandedField: 'expanded',
        hasChildrenField: 'children',
        animateExpand: true
    };

    public constructor() {
        setInterval(() => {
            console.log("Tree data: ", this.treeNodes);
        }, 10000);
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {
    }
}

export interface TreeData {
    id: number,
    name: string,
    children: TreeData[],
    data: any,
    opened: boolean,
}
