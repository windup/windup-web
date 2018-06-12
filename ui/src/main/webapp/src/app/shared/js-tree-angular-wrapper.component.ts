import {
    Component, OnInit, Input, ElementRef, SimpleChange, Output, EventEmitter, NgZone,
    OnChanges, OnDestroy
} from "@angular/core";
import {Package} from "../generated/windup-services";
import * as $ from "jquery";
import 'jstree';
import {SchedulerService} from "./scheduler.service";

/**
 * Wrapper for jstree from: https://www.jstree.com/
 */
@Component({
    templateUrl: './js-tree-angular-wrapper.component.html',
    selector: 'wu-js-tree-wrapper',
    host: { 'style': 'display: block; overflow: auto;' }
})
export class JsTreeAngularWrapperComponent implements OnInit, OnChanges, OnDestroy {
    @Input()
    treeNodes: TreeData[];

    @Input()
    hasCheckboxes: boolean = true;

    treeNodesMap: {[id: string]: TreeData} = {};

    jsTree = [];

    @Input()
    selectedNodes: TreeData[];

    @Output()
    selectedNodesChange: EventEmitter<TreeData[]> = new EventEmitter<TreeData[]>();

    @Output()
    nodeClicked: EventEmitter<TreeData> = new EventEmitter<TreeData>();

    protected element;

    protected updateSelectionCallback: Function = () => {};
    protected static EMPTY_CALLBACK = () => {};

    protected treeRedrawTimeout: any;

    public constructor(element: ElementRef, private _zone: NgZone, private _schedulerService: SchedulerService) {

        console.log("jstree:constructor");
        this.element = element.nativeElement;
    }

    ngOnChanges(changes: {[treeNodes: string]: SimpleChange}): any {

        console.log("jstree:change begin");

        for (let node of this.selectedNodes) {
            console.log(node.name);
        }
        let jsTree = $(this.element).jstree(true);

        // This is ugly workaround to prevent recursively calling ngOnChanges from change handler
        this.updateSelectionCallback = JsTreeAngularWrapperComponent.EMPTY_CALLBACK;

        if (jsTree) {
            if (changes.hasOwnProperty('treeNodes')) {
                console.log("jstree:change treeNodes");
                for (let treenode of changes['treeNodes'].currentValue) {
                    console.log(treenode.name);
                    //console.log(treenode.is_checked);
                }
                let newTreeNodes: Package[] = changes['treeNodes'].currentValue;
                this.jsTree = newTreeNodes.map((node) => this.transformTreeNode(node));
                (jsTree as any).settings.core.data = this.jsTree;
                jsTree.redraw(true);
                jsTree.refresh(true, false);
            }

            if (changes.hasOwnProperty('selectedNodes')) {
                console.log("jstree:change selectedNodes");
                // Another ugly workaround, now to give enough time to initialize jsTree first
                this._schedulerService.setTimeout(this._zone.run(() => this.redrawSelection()), 100);
            }

            // This is ugly workaround to prevent recursively calling ngOnChanges from change handler
            this.updateSelectionCallback = this.updateSelectedNodes;
        }


        console.log("jstree:change end");
    }

    transformTreeNode(node: any): any {

        let transformed = {
            id: node.id,
            text: node.name,
            children: [],
            original: node,
            state: {}
        };

        if (node.opened) {
            transformed.state = {
                opened: node.opened
            }
        }

        let self = this;

        if (node.childs) {
            transformed.children = node.childs.map((mapNode) => self.transformTreeNode(mapNode));
        }

        this.treeNodesMap[node.id] = node;

        return transformed;
    }

    ngOnInit() {
        console.log("jstree:init");
        let self = this;

        if (this.treeNodes) {
            this.jsTree = this.treeNodes.map((node) => self.transformTreeNode(node));
        }

        let plugins = this.hasCheckboxes ? ['checkbox'] : [];
        plugins.push('sort');

        $(this.element).jstree({
            'plugins': plugins,
            'core': {
                data: this.jsTree
            },
            'checkbox': {
                'tie_selection': false,
                'cascade': 'undetermined+down',
                'three_state': false
            }
        });

        $(this.element).on('check_node.jstree uncheck_node.jstree', (event, data) => this.updateSelectionCallback(event, data));
        $(this.element).on('select_node.jstree', (event, data) => this.fireNodeClicked(event, data));
        $(this.element).on('changed.jstree loaded.jstree', (event, data) => this.redrawSelection());
    }

    ngOnDestroy(): void {

        console.log("jstree:destroy");
        if (this.treeRedrawTimeout) {
            this._schedulerService.clearTimeout(this.treeRedrawTimeout);
            this.treeRedrawTimeout = null;
        }
    }

    fireNodeClicked(event, data) {
        console.log("jstree:fireNodeClicked")
        this.nodeClicked.emit(this.treeNodesMap[data.node.id]);
    }

    updateSelectedNodes(event, data) {
        console.log("jstree:updateSelectedNodes begin");
        let jsTree = $(this.element).jstree(true);

        if (jsTree) {
            this._zone.run(() => {
                this.selectedNodes = jsTree.get_checked(false).map((id) => this.treeNodesMap[id]);
                this.selectedNodesChange.emit(this.selectedNodes);
            });
        }
        console.log("jstree:updateSelectedNodes end");
    }

    redrawSelection() {

        console.log("jstree:redrawSelection begin");
        let jsTree = $(this.element).jstree(true);
        console.log("Number of Nodes: " + this.selectedNodes.length);
        if (jsTree && this.selectedNodes.length > 0) {
            console.log("jstree:redrawSelection: updating");
            let selectionIds = this.selectedNodes.map(node => node.id);
            for (let id of selectionIds) {
                console.log(id.valueOf());
            }
            jsTree.check_node(selectionIds, null);
        }
        console.log("jstree:redrawSelection end");
    }
}

export interface TreeData {
    id: number,
    name: string,
    childs: TreeData[],
    data: any,
    opened: boolean
}
