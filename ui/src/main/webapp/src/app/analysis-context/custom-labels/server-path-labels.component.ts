import { Component, Input, EventEmitter, Output, TemplateRef, AfterContentInit, Renderer2, ElementRef, AfterViewInit, AfterViewChecked, OnInit, OnChanges, DoCheck } from "@angular/core";
import { Action, ActionConfig } from "patternfly-ng/action";
import { ListEvent, ListConfig } from "patternfly-ng/list";
import { EmptyStateConfig } from "patternfly-ng/empty-state";
import { cloneDeep } from 'lodash';
import { LabelsPath, LabelProviderEntity } from "../../generated/windup-services";
import { ToolbarConfig } from "patternfly-ng/toolbar";
import { FilterEvent, Filter, FilterField, FilterConfig, FilterType } from "patternfly-ng/filter";
import { LabelService } from "../../configuration/label.service";
import { ModalOptions, BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ServerPathLabelsModalComponent } from "./server-path-labels-modal.component";

@Component({
    selector: 'wu-server-path-labels',
    templateUrl: './server-path-labels.component.html',
    styleUrls: ['./server-path-labels.component.scss']
})
export class ServerPathLabelsComponent implements DoCheck {

    _labelsPath: LabelsPath[];

    @Output() onSelectionChange = new EventEmitter<LabelsPath[]>();
    @Output() onAddLabelsPathRequest = new EventEmitter<boolean>();
    @Output() onDeleteLabelsPathRequest = new EventEmitter<LabelsPath>();

    items: LabelsPath[] = [];
    allItems: LabelsPath[] = [];
    selectedItems: LabelsPath[] = [];

    labelProviders = new Map<number, LabelProviderEntity[]>();

    _initialSelectedRows: LabelsPath[];

    // Toolbar config

    toolbarConfig: ToolbarConfig;
    toolbarActionConfig: ActionConfig;
    toolbarFilterConfig: FilterConfig;

    // List view config

    listConfig: ListConfig;
    listActionConfig: ActionConfig;
    listSelectType: string = 'checkbox';
    listEmptyStateConfig: EmptyStateConfig;

    private bsModalRef: BsModalRef;

    constructor(
        private _labelService: LabelService,
        private _modalService: BsModalService
    ) {
    }

    ngDoCheck() {
        $('#serverPathLabelsList .btn-danger').removeClass('btn-default');
    }

    ngOnInit(): void {
        // Toolbar config

        this.toolbarFilterConfig = {
            fields: [{
                id: 'name',
                title: 'Name',
                placeholder: 'Filter by Name...',
                type: FilterType.TEXT
            }] as FilterField[],
            resultsCount: this.items.length,
            appliedFilters: []
        } as FilterConfig;

        this.toolbarActionConfig = {
            primaryActions: [{
                id: 'addLabel',
                title: 'Add',
                tooltip: 'Add custom label',
                styleClass: 'btn btn-primary'
            }],
            moreActions: [{
                id: 'selectAll',
                title: 'Select all >>',
                tooltip: 'Select all items'
            }]
        } as ActionConfig;

        this.toolbarConfig = {
            actionConfig: this.toolbarActionConfig,
            filterConfig: this.toolbarFilterConfig,
            views: []
        } as ToolbarConfig;

        // List view config

        this.listEmptyStateConfig = {
            actions: {
                primaryActions: [],
                moreActions: []
            } as ActionConfig,
            iconStyleClass: 'pficon-info',
            title: 'No custom labels available'
        } as EmptyStateConfig;

        this.listActionConfig = {
            primaryActions: [{
                id: 'view',
                title: 'View',
                tooltip: 'View'
            }, {
                id: 'delete',
                title: 'Delete',
                tooltip: 'Delete server label path',
                styleClass: 'btn-danger'
            }],
            moreActions: [],
            moreActionsDisabled: false,
            moreActionsVisible: true
        } as ActionConfig;

        this.listConfig = {
            dblClick: false,
            emptyStateConfig: this.listEmptyStateConfig,
            multiSelect: false,
            selectItems: false,
            selectionMatchProp: 'name',
            showCheckbox: true,
            showRadioButton: false,
            useExpandItems: true,
            hideClose: true
        } as ListConfig;
    }

    @Input()
    set labelsPath(labelsPath: LabelsPath[]) {
        if (labelsPath !== undefined && labelsPath != null) {
            this._labelsPath = labelsPath;
            this.loadLabelsPath();
            this.initList();
        }
    }

    @Input()
    set initialSelectedRows(initialSelectedRows: LabelsPath[]) {
        this._initialSelectedRows = initialSelectedRows;
        this.initList();
    }

    loadLabelsPath() {
        this._labelsPath.forEach((labelPath: LabelsPath) => {
            this._labelService.getByLabelsPath(labelPath).subscribe((labelsProvider: LabelProviderEntity[]) => {
                this.labelProviders.set(labelPath.id, labelsProvider);
            });
        });

        this.allItems = this._labelsPath;
        this.items = cloneDeep(this.allItems);
    }

    getLabelsProvider(item: LabelsPath): LabelProviderEntity[] {
        return this.labelProviders.get(item.id);
    }

    initList() {
        if (this._labelsPath !== undefined && this._labelsPath != null) {
            const labelsPath = [...this._labelsPath];

            if (this._initialSelectedRows && this._initialSelectedRows.length > 0) {
                labelsPath.forEach(labelProvider => {
                    (<any>labelProvider).selected = this._initialSelectedRows.some(p => p.id == labelProvider.id);
                });
            } else {
                labelsPath.forEach(labelProvider => {
                    (<any>labelProvider).selected = false;
                });
            }

            this.allItems = labelsPath;
            this.items = this.allItems;
        }
    }

    // Filter

    /**
     * Handle filter changes
     */
    filterChanged($event: FilterEvent): void {
        this.applyFilters($event.appliedFilters);
        this.filterFieldSelected($event);
    }

    applyFilters(filters: Filter[]): void {
        this.items = [];
        if (filters && filters.length > 0) {
            this.allItems.forEach((item) => {
                if (this.matchesFilters(item, filters)) {
                    this.items.push(item);
                }
            });
        } else {
            this.items = this.allItems;
        }
        this.toolbarConfig.filterConfig.resultsCount = this.items.length;
    }

    // Reset filtered queries
    filterFieldSelected($event: FilterEvent): void {
        // TODO nothing to do since we have just one filter "Name"
    }

    matchesFilter(item: LabelsPath, filter: Filter): boolean {
        let match = true;
        if (filter.field.id === 'name') {
            match = item.path.match(filter.value) !== null;
        }
        return match;
    }

    matchesFilters(item: LabelsPath, filters: Filter[]): boolean {
        let matches = true;
        filters.forEach((filter) => {
            if (!this.matchesFilter(item, filter)) {
                matches = false;
                return matches;
            }
        });
        return matches;
    }

    //

    /**
     * Get the tracking id to use for each row
     *
     * @param index The current row index
     * @param item The current row item
     * @returns number
     */
    trackByIndex(index: number, item: any): any {
        return index;
    }

    // Actions

    handleToolbarAction(action: Action): void {
        if (action.id == 'addLabel') {
            this.onAddLabelsPathRequest.emit(true);
        } else if (action.id == 'selectAll') {
            this.selectItems(this.allItems);
        }
    }

    handleListAction($event: Action, item: LabelsPath): void {
        if ($event.id === 'delete' && item !== null) {
            this.onDeleteLabelsPathRequest.emit(item);
        } else if ($event.id === 'view' && item !== null) {
            this.openLabelPathModal(item);
        }
    }

    handleListSelectionChange($event: ListEvent): void {
        this.selectItems($event.selectedItems);
    }

    // Row selection

    // Modal

    /**
     * Opens a modal for showing the content of a LabelPath
     */
    openLabelPathModal(labelPath: LabelsPath) {
        const config: ModalOptions = {
            class: 'modal-lg',
            initialState: {
                labelPath: labelPath,
                labelProviders: this.getLabelsProvider(labelPath)
            }
        };
        this.bsModalRef = this._modalService.show(ServerPathLabelsModalComponent, config);
    }

    //

    selectItems(items: LabelsPath[]) {
        this.selectedItems = items;
        this.onSelectionChange.emit(this.selectedItems);
    }
}

