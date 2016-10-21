import {
    Component, OnInit, Input, ElementRef, SimpleChange, Output, EventEmitter, NgZone,
    OnChanges
} from "@angular/core";
import {Package} from "../windup-services";
import * as $ from "jquery";
import 'jstree';

@Component({
    templateUrl: 'js-tree-angular-wrapper.component.html',
    selector: 'app-js-tree-wrapper'
})
export class JsTreeAngularWrapperComponent implements OnInit, OnChanges {
    @Input()
    treeNodes: Package[];

    treeNodesMap: {[id: string]: Package} = {};

    jsTree = [];

    @Input()
    selectedNodes: Package[];

    @Output()
    selectedNodesChange: EventEmitter<Package[]> = new EventEmitter<Package[]>();

    protected element;

    protected updateSelectionCallback: Function = () => {};
    protected static EMPTY_CALLBACK = () => {};

    public constructor(element: ElementRef, private _zone: NgZone) {
        this.element = element.nativeElement;
    }

    ngOnChanges(changes: {[treeNodes: string]: SimpleChange}): any {
        let jsTree = $(this.element).jstree(true);

        // This is ugly workaround to prevent recursively calling ngOnChanges from change handler
        this.updateSelectionCallback = JsTreeAngularWrapperComponent.EMPTY_CALLBACK;

        if (jsTree) {
            if (changes.hasOwnProperty('treeNodes')) {
                let newTreeNodes: Package[] = changes['treeNodes'].currentValue;
                this.jsTree = newTreeNodes.map((node) => this.transformTreeNode(node));
                (jsTree as any).settings.core.data = this.jsTree;
                jsTree.redraw(true);
                jsTree.refresh(true, false);
            }

            if (changes.hasOwnProperty('selectedNodes')) {
                // Another ugly workaround, now to give enough time to initialize jsTree first
                setTimeout(() => this.redrawSelection(), 100);
            }
        }

        // This is ugly workaround to prevent recursively calling ngOnChanges from change handler
        this.updateSelectionCallback = this.updateSelectedNodes;
    }

    transformTreeNode(node: any): any {
        let transformed = {
            id: node.id,
            text: node.name,
            children: [],
            original: node
        };

        let self = this;

        if (node.childs) {
            transformed.children = node.childs.map((mapNode) => self.transformTreeNode(mapNode));
        }

        this.treeNodesMap[node.id] = node;

        return transformed;
    }

    ngOnInit() {
        let self = this;

        if (this.treeNodes) {
            this.jsTree = this.treeNodes.map((node) => self.transformTreeNode(node));
        }

        $(this.element).jstree({
            'plugins': ['checkbox', 'sort'],
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
        $(this.element).on('changed.jstree loaded.jstree', (event, data) => this.redrawSelection());
    }

    updateSelectedNodes(event, data) {
        let jsTree = $(this.element).jstree(true);

        if (jsTree) {
            this._zone.run(() => {
                this.selectedNodes = jsTree.get_checked(false).map((id) => this.treeNodesMap[id]);
                this.selectedNodesChange.emit(this.selectedNodes);
            });
        }
    }

    redrawSelection() {
        let jsTree = $(this.element).jstree(true);

        if (jsTree && this.selectedNodes) {
            let selectionIds = this.selectedNodes.map(node => node.id);
            jsTree.check_node(selectionIds, null);
        }
    }
}
