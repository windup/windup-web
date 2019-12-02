import { Component, TemplateRef, ViewChild, OnInit, AfterViewInit, Input, EventEmitter, Output, ChangeDetectorRef } from "@angular/core";
import { PaginationEvent, PaginationConfig } from "patternfly-ng/pagination";
import { FilterEvent, Filter, FilterConfig, FilterType, FilterField, FilterQuery } from "patternfly-ng/filter";
import { Action, ActionConfig } from "patternfly-ng/action";
import { LabelsPath, LabelProviderEntity } from "../../../generated/windup-services";
import { EmptyStateConfig } from "patternfly-ng/empty-state";
import { TableConfig, NgxDataTableConfig, TableEvent, TableComponent } from "patternfly-ng/table";
import { ToolbarConfig } from "patternfly-ng/toolbar/toolbar-config";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { Observable, forkJoin } from "rxjs";
import { LabelService } from "../../../configuration/label.service";
import { UploadedLabelPathModalComponent } from "./modal/uploaded-label-path-modal.component";
import { tap, reduce, map } from "rxjs/operators";

@Component({
    selector: 'wu-uploaded-labels-path',
    templateUrl: './uploaded-labels-path.component.html'
})
export class UploadedLabelsPathComponent implements OnInit {

    _labelsPath: LabelsPath[];
    _selectedLabelsPath: LabelsPath[] = [];
    _labelProviders: LabelProviderEntity[] = [];
    _labelProviderLabelsPathMap = new Map<LabelProviderEntity, LabelsPath>();

    @Output() onSelectionChange = new EventEmitter<LabelsPath[]>();
    @Output() onAddLabelsPathRequest = new EventEmitter<boolean>();
    @Output() onDeleteLabelsPathRequest = new EventEmitter<LabelsPath>();

    @ViewChild('shortPathTemplate') shortPathTemplate: TemplateRef<any>;
    @ViewChild('labelsTemplate') labelsTemplate: TemplateRef<any>;
    @ViewChild('actionsTemplate') actionsTemplate: TemplateRef<any>;

    rows: LabelProviderEntity[];
    allRows: LabelProviderEntity[];
    filteredRows: LabelProviderEntity[];
    selectedRows: LabelProviderEntity[] = [];

    columns: any[];

    tableConfig: TableConfig;
    filterConfig: FilterConfig = {
        fields: [
            {
                id: 'name',
                title: 'Name',
                placeholder: 'Filter by name...',
                type: FilterType.TEXT
            }] as FilterField[],
        appliedFilters: [],
        resultsCount: 0,
        totalCount: 0
    } as FilterConfig;

    actionConfig: ActionConfig = {
        primaryActions: [],
        moreActions: [{
            id: 'selectAll',
            title: 'Select all >>',
            tooltip: 'Select all items'
        }]
    } as ActionConfig;

    toolbarConfig: ToolbarConfig = {
        actionConfig: this.actionConfig,
        filterConfig: this.filterConfig
    } as ToolbarConfig;

    emptyStateConfig: EmptyStateConfig = {
        actions: {
            primaryActions: [],
            moreActions: []
        } as ActionConfig,
        iconStyleClass: 'pficon-info',
        title: 'No custom labels available'
    } as EmptyStateConfig;

    paginationConfig: PaginationConfig = {
        pageNumber: 1,
        pageSize: 5,
        pageSizeIncrements: [3, 5, 10],
        totalItems: 0
    } as PaginationConfig;

    dataTableConfig: NgxDataTableConfig = {
        columnMode: 'flex',
        rowClass: (row: LabelProviderEntity) => {
            return row.loadError ? 'row-danger' : 'row-success';
        }
    } as NgxDataTableConfig;;

    isAscendingSort: boolean = true;

    private bsModalRef: BsModalRef;

    constructor(
        private _labelService: LabelService,
        private _modalService: BsModalService
    ) { }

    ngOnInit(): void {
        this.columns = [{
            cellTemplate: this.shortPathTemplate,
            draggable: false,
            prop: 'labelsPath',
            name: 'Short path',
            resizeable: false,
            sortable: false,
            flexGrow: 3,
            cellClass: 'line-height-25'
        }, {
            cellTemplate: this.labelsTemplate,
            draggable: false,
            prop: 'labels',
            name: '# Labels',
            resizeable: false,
            sortable: false,
            flexGrow: 1,
            cellClass: 'line-height-25'
        }, {
            cellTemplate: this.actionsTemplate,
            draggable: false,
            prop: 'id',
            name: 'Actions',
            resizeable: false,
            sortable: false,
            flexGrow: 1.5,
            cellClass: 'line-height-25 text-center-override'
        }];

        this.tableConfig = {
            emptyStateConfig: this.emptyStateConfig,
            paginationConfig: this.paginationConfig,
            showCheckbox: true,
            toolbarConfig: this.toolbarConfig
        } as TableConfig;
    }

    @Input()
    set labelsPath(labelsPath: LabelsPath[]) {
        if (labelsPath !== undefined && labelsPath != null) {
            this._labelsPath = labelsPath;
            this._labelProviderLabelsPathMap.clear();

            if (this._labelsPath.length == 0) {
                this._labelProviders = [];
                this.initTable();
            } else {
                const labelProviders: Observable<LabelProviderEntity[]>[] = this._labelsPath.map((labelPath: LabelsPath) => {
                    return this._labelService.getByLabelsPath(labelPath).pipe(
                        tap((labelProviders: LabelProviderEntity[]) => {
                            labelProviders.forEach((provider: LabelProviderEntity) => {
                                this._labelProviderLabelsPathMap.set(provider, labelPath);
                            });
                        })
                    );
                });
                forkJoin(labelProviders).pipe(
                    map((labelProviders: LabelProviderEntity[][]) => {
                        let result: LabelProviderEntity[] = [];
                        for (var i = 0; i < labelProviders.length; i++) {
                            result = result.concat(labelProviders[i]);
                        }
                        return result;
                    })
                ).subscribe((labelProviders: LabelProviderEntity[]) => {
                    this._labelProviders = labelProviders;
                    this.initTable();
                });
            }
        }
    }

    @Input()
    set initialSelectedRows(initialSelectedRows: LabelsPath[]) {
        if (initialSelectedRows !== undefined && initialSelectedRows != null) {
            this._selectedLabelsPath = initialSelectedRows;
            this.initTable();
        }
    }

    initTable() {
        this.selectedRows = [];
        if (this._selectedLabelsPath) {
            this._labelProviders.forEach((labelProvider: LabelProviderEntity) => {
                const labelsPath: LabelsPath = this._labelProviderLabelsPathMap.get(labelProvider);

                var indexOfRow = this._selectedLabelsPath.findIndex(r => r.id === labelsPath.id);
                if (indexOfRow >= 0) {
                    (<any>labelProvider).selected = true;
                    this.selectedRows.push(labelProvider);
                } else {
                    (<any>labelProvider).selected = false;
                }
            });
        }

        this.allRows = this._labelProviders;
        this.filteredRows = this.allRows;

        this.updateRows(false); // Reinitialize expanded rows in order to render properly with tabs
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
        if (filters && filters.length > 0) {
            this.filteredRows = [];

            this.allRows.forEach((item) => {
                if (this.matchesFilters(item, filters)) {
                    this.filteredRows.push(item);
                }
            });
        } else {
            this.filteredRows = this.allRows;
        }
        this.toolbarConfig.filterConfig.resultsCount = this.filteredRows.length;
        this.updateRows(true);
    }

    matchesFilters(item: LabelProviderEntity, filters: Filter[]): boolean {
        let matches = true;
        filters.forEach((filter) => {
            if (!this.matchesFilter(item, filter)) {
                matches = false;
                return matches;
            }
        });
        return matches;
    }

    matchesFilter(item: LabelProviderEntity, filter: Filter): boolean {
        let match = true;
        if (filter.field.id === 'name') {
            const regexp = new RegExp(filter.value, 'i');
            match = item.labelsPath.shortPath.match(regexp) !== null;
        }
        return match;
    }

    /**
     * Reset filtered queries
     */
    filterFieldSelected($event: FilterEvent): void {
        // TODO nothing to do since we have just one filter "Name"
    }


    // Actions

    /**
     * Handle UI actions
     */
    handleAction(action: Action): void {
        if (action.id == 'selectAll') {
            this.selectedRows = [];
            this.selectRows(this.allRows.map(r => {
                (<any>r).selected = true;
                return r;
            }));
        }
    }

    /**
     * Filter queries for type ahead
     */
    filterQueries($event: FilterEvent) {
        // TODO nothing to do since we don't have TYPE_AHEAD filters
    }


    // Pagination

    handlePageSize($event: PaginationEvent): void {
        this.updateRows(false);
    }

    handlePageNumber($event: PaginationEvent): void {
        this.updateRows(false);
    }

    updateRows(reset: boolean): void {
        if (reset) {
            this.paginationConfig.pageNumber = 1;
        }

        this.paginationConfig.totalItems = this.filteredRows.length;
        this.rows = this.filteredRows
            .slice((this.paginationConfig.pageNumber - 1) * this.paginationConfig.pageSize, this.paginationConfig.totalItems)
            .slice(0, this.paginationConfig.pageSize);
    }


    // Selection

    /**
     * This method is called everytime the selected rows change
     */
    handleSelectionChange($event: TableEvent): void {
        if ($event.row) {
            this.selectRows([$event.row]);
        } else {
            if ($event.selectedRows.length > 0) {
                this.selectRows($event.selectedRows);
            } else {
                this.selectRows(this.rows.map(r => {
                    (<any>r).selected = false;
                    return r;
                }));
            }
        }
    }


    // Modal

    /**
     * Opens a modal for showing the content of a LabelPath
     */
    openLabelProviderModal(labelProvider: LabelProviderEntity) {
        const config: ModalOptions = {
            class: 'modal-lg',
            initialState: {
                labelProvider: labelProvider
            }
        };
        this.bsModalRef = this._modalService.show(UploadedLabelPathModalComponent, config);
    }


    // 

    requestDisplayAddLabelsPathModal() {
        this.onAddLabelsPathRequest.emit(true);
    }

    requestDisplayDeleteLabelsPathConfirmationModal(labelProvider: LabelProviderEntity) {
        this.onDeleteLabelsPathRequest.emit(labelProvider.labelsPath);
    }

    //

    selectRows(rows: LabelProviderEntity[]) {
        rows.forEach((row: LabelProviderEntity) => {
            var indexOfRow = this.selectedRows.findIndex(i => i.id === row.id);
            if ((<any>row).selected) {
                if (indexOfRow == -1) {
                    this.selectedRows.push(row);
                }
            } else {
                this.selectedRows.splice(indexOfRow, 1);
            }
        });
        this.updateValue();
    }

    updateValue() {
        const labelsPath: LabelsPath[] = this.selectedRows.map((row: LabelProviderEntity) => {
            return this._labelProviderLabelsPathMap.get(row);
        });
        this.onSelectionChange.emit(labelsPath);
    }

}
