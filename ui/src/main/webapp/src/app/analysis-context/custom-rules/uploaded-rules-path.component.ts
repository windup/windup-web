import { Component, TemplateRef, ViewChild, OnInit, AfterViewInit, Input, EventEmitter, Output, ChangeDetectorRef } from "@angular/core";
import { PaginationEvent, PaginationConfig } from "patternfly-ng/pagination";
import { FilterEvent, Filter, FilterConfig, FilterType, FilterField, FilterQuery } from "patternfly-ng/filter";
import { Action, ActionConfig } from "patternfly-ng/action";
import { RulesPath, RuleProviderEntity } from "../../generated/windup-services";
import { EmptyStateConfig } from "patternfly-ng/empty-state";
import { TableConfig, NgxDataTableConfig, TableEvent, TableComponent } from "patternfly-ng/table";
import { ToolbarConfig } from "patternfly-ng/toolbar/toolbar-config";
import { getAvailableFilters } from "../../configuration/technology-filter";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { Observable, forkJoin } from "rxjs";
import { RuleService } from "../../configuration/rule.service";
import { UploadedRulePathModalComponent } from "./uploaded-rule-path-modal.component";

@Component({
    selector: 'wu-uploaded-rules-path',
    templateUrl: './uploaded-rules-path.component.html'
})
export class UploadedRulesPathComponent implements OnInit, AfterViewInit {

    _rulesPath: RulesPath[];
    _rulesPathMap = new Map<number, RulesPath>();
    _ruleProviders: RuleProviderEntity[];

    @Output() onSelectionChange = new EventEmitter<RulesPath[]>();
    @Output() onAddRulesPathRequest = new EventEmitter<boolean>();
    @Output() onDeleteRulesPathRequest = new EventEmitter<RulesPath>();

    @ViewChild('shortPathTemplate') shortPathTemplate: TemplateRef<any>;
    @ViewChild('sourceTargetTemplate') sourceTargetTemplate: TemplateRef<any>;
    @ViewChild('rulesTemplate') rulesTemplate: TemplateRef<any>;
    @ViewChild('actionsTemplate') actionsTemplate: TemplateRef<any>;

    allRows: RuleProviderEntity[] = [];
    filteredRows: RuleProviderEntity[] = [];
    selectedRows: RuleProviderEntity[] = [];

    rows: RuleProviderEntity[];
    columns: any[];

    _initialSelectedRows: RulesPath[];
    _initialSelectedRowsMap = new Map<number, RulesPath>();

    tableConfig: TableConfig;
    filterConfig: FilterConfig;
    actionConfig: ActionConfig;
    toolbarConfig: ToolbarConfig;
    emptyStateConfig: EmptyStateConfig;
    paginationConfig: PaginationConfig;
    dataTableConfig: NgxDataTableConfig;

    isAscendingSort: boolean = true;

    private sourceQueries: any[] = [];
    private targetQueries: any[] = [];

    private bsModalRef: BsModalRef;

    constructor(
        private _ruleService: RuleService,
        private _modalService: BsModalService
    ) { }

    ngAfterViewInit() {
        this.updateRows(false); // Reinitialize expanded rows in order to render properly with tabs
    }

    ngOnInit(): void {
        this.columns = [{
            cellTemplate: this.shortPathTemplate,
            draggable: false,
            prop: 'rulesPath',
            name: 'Short path',
            resizeable: false,
            sortable: false,
            flexGrow: 3,
            cellClass: 'line-height-25'
        }, {
            cellTemplate: this.sourceTargetTemplate,
            draggable: false,
            prop: 'sources',
            name: 'Source / Target',
            resizeable: false,
            sortable: false,
            flexGrow: 2,
            cellClass: 'line-height-25'
        }, {
            cellTemplate: this.rulesTemplate,
            draggable: false,
            prop: 'rules',
            name: '# Rules',
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

        this.paginationConfig = {
            pageNumber: 1,
            pageSize: 5,
            pageSizeIncrements: [3, 5, 10],
            totalItems: this.filteredRows.length
        } as PaginationConfig;

        // Need to initialize for results/total counts
        this.updateRows(false);

        this.emptyStateConfig = {
            actions: {
                primaryActions: [],
                moreActions: []
            } as ActionConfig,
            iconStyleClass: 'pficon-info',
            title: 'No custom rules available'
        } as EmptyStateConfig;

        this.filterConfig = {
            fields: [
                {
                    id: 'source',
                    title: 'Source',
                    placeholder: 'Select an Option',
                    type: FilterType.TYPEAHEAD,
                    queries: [
                        ...this.sourceQueries
                    ]
                },
                {
                    id: 'target',
                    title: 'target',
                    placeholder: 'Select an Option',
                    type: FilterType.TYPEAHEAD,
                    queries: [
                        ...this.targetQueries
                    ]
                }] as FilterField[],
            appliedFilters: [],
            resultsCount: this.rows.length,
            totalCount: this.allRows.length
        } as FilterConfig;

        this.actionConfig = {
            primaryActions: [],
            moreActions: [{
                id: 'selectAll',
                title: 'Select all >>',
                tooltip: 'Select all items'
            }]
        } as ActionConfig;

        this.toolbarConfig = {
            actionConfig: this.actionConfig,
            filterConfig: this.filterConfig,
            // sortConfig: this.sortConfig
        } as ToolbarConfig;

        this.tableConfig = {
            emptyStateConfig: this.emptyStateConfig,
            paginationConfig: this.paginationConfig,
            showCheckbox: true,
            toolbarConfig: this.toolbarConfig
        } as TableConfig;

        this.dataTableConfig = {
            columnMode: 'flex',
            rowClass: (row: RuleProviderEntity) => {
                return row.loadError ? 'row-danger' : 'row-success';
            }
        } as NgxDataTableConfig;
    }

    @Input()
    set rulesPath(rulesPath: RulesPath[]) {
        if (rulesPath !== undefined && rulesPath != null) {
            this._rulesPath = rulesPath;
            this._rulesPathMap.clear();

            this.loadRuleProviders();
        }
    }

    @Input()
    set initialSelectedRows(initialSelectedRows: RulesPath[]) {
        this._initialSelectedRows = initialSelectedRows;
        this._initialSelectedRowsMap.clear();

        if (initialSelectedRows !== undefined && initialSelectedRows != null) {
            this._initialSelectedRows.forEach(row => {
                this._initialSelectedRowsMap.set(row.id, row);
            });
        }

        this.initTable();
    }

    loadRuleProviders() {
        if (this._rulesPath.length == 0) {
            this._ruleProviders = [];
            this.initTable();
        } else {
            const ruleProviders: Observable<RuleProviderEntity[]>[] = this._rulesPath.map((rulePath: RulesPath) => {
                this._rulesPathMap.set(rulePath.id, rulePath);
                return this._ruleService.getByRulesPath(rulePath);
            });
            forkJoin(ruleProviders).subscribe((ruleProviders: RuleProviderEntity[][]) => {
                let rules: RuleProviderEntity[] = [];
                for (var i = 0; i < ruleProviders.length; i++) {
                    rules = rules.concat(ruleProviders[i]);
                }

                this._ruleProviders = rules;
                this.initTable();
            });
        }
    }

    initTable() {
        if (this._ruleProviders !== undefined && this._ruleProviders != null) {
            const ruleProviders = [...this._ruleProviders];

            if (this._initialSelectedRows && this._initialSelectedRows.length > 0) {
                ruleProviders.forEach(ruleProvider => {
                    (<any>ruleProvider).selected = this._initialSelectedRowsMap.has(ruleProvider.rulesPath.id);
                });
            } else {
                ruleProviders.forEach(ruleProvider => {
                    (<any>ruleProvider).selected = false;
                });
            }

            this.allRows = ruleProviders;
            this.filteredRows = this.allRows;
            this.updateRows(false); // Reinitialize expanded rows in order to render properly with tabs
            this.loadQueryFilters();
        }
    }

    // Queries

    loadQueryFilters() {
        this.sourceQueries = getAvailableFilters(this.allRows, 'sources').map((elem) => {
            return {
                value: elem.name,
                filterOption: elem
            } as FilterQuery;
        });

        this.targetQueries = getAvailableFilters(this.allRows, 'targets').map((elem) => {
            return {
                value: elem.name,
                filterOption: elem
            } as FilterQuery;
        });

        const sourceIndex = (this.filterConfig.fields as any).findIndex((i: any) => i.id === 'source');
        const targetIndex = (this.filterConfig.fields as any).findIndex((i: any) => i.id === 'target');

        this.filterConfig.fields[sourceIndex].queries = [...this.sourceQueries];
        this.filterConfig.fields[targetIndex].queries = [...this.targetQueries];
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

    matchesFilters(item: any, filters: Filter[]): boolean {
        let matches = true;
        filters.forEach((filter) => {
            if (!this.matchesFilter(item, filter)) {
                matches = false;
                return matches;
            }
        });
        return matches;
    }

    matchesFilter(item: any, filter: Filter): boolean {
        let match = true;
        if (filter.field.id === 'source') {
            match = (<any>filter.query).filterOption.callback(item);
        } else if (filter.field.id === 'target') {
            match = (<any>filter.query).filterOption.callback(item);
        }
        return match;
    }

    /**
     * Reset filtered queries
     */
    filterFieldSelected($event: FilterEvent): void {
        this.filterConfig.fields.forEach((field) => {
            if (field.id === 'source') {
                field.queries = [
                    ...this.sourceQueries
                ];
            } else if (field.id === 'target') {
                field.queries = [
                    ...this.targetQueries
                ];
            }
        });
    }


    // Actions

    /**
     * Handle UI actions
     */
    handleAction(action: Action): void {
        if (action.id == 'selectAll') {
            this.selectRows(this.allRows);
        }
    }

    /**
     * Filter queries for type ahead
     */
    filterQueries($event: FilterEvent) {
        const index = (this.filterConfig.fields as any).findIndex((i: any) => i.id === $event.field.id);
        let val = $event.value.trim();

        if (this.filterConfig.fields[index].id === 'source') {
            this.filterConfig.fields[index].queries = [
                ...this.sourceQueries.filter((item: any) => {
                    if (item.value) {
                        return (item.value.toLowerCase().indexOf(val.toLowerCase()) > -1);
                    } else {
                        return true;
                    }
                })
            ];
        } else if (this.filterConfig.fields[index].id === 'target') {
            this.filterConfig.fields[index].queries = [
                ...this.targetQueries.filter((item: any) => {
                    if (item.value) {
                        return (item.value.toLowerCase().indexOf(val.toLowerCase()) > -1);
                    } else {
                        return true;
                    }
                })
            ];
        }
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
        this.selectRows($event.selectedRows);
    }


    // Modal

    /**
     * Opens a modal for showing the content of a RulePath
     */
    openRuleProviderModal(ruleProvider: RuleProviderEntity) {
        const config: ModalOptions = {
            class: 'modal-lg',
            initialState: {
                ruleProvider: ruleProvider
            }
        };
        this.bsModalRef = this._modalService.show(UploadedRulePathModalComponent, config);
    }


    // 

    requestDisplayAddRulesPathModal() {
        this.onAddRulesPathRequest.emit(true);
    }

    requestDisplayDeleteRulesPathConfirmationModal(ruleProvider: RuleProviderEntity) {
        this.onDeleteRulesPathRequest.emit(ruleProvider.rulesPath);
    }

    //

    selectRows(rows: RuleProviderEntity[]) {
        this.selectedRows = rows;

        const rulesPath: RulesPath[] = rows.map((ruleProvider: RuleProviderEntity) => {
            return this._rulesPathMap.get(ruleProvider.rulesPath.id);
        });
        this.onSelectionChange.emit(rulesPath);
    }

}
