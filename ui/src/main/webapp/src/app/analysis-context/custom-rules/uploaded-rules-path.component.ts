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
import { tap, reduce, map } from "rxjs/operators";

@Component({
    selector: 'wu-uploaded-rules-path',
    templateUrl: './uploaded-rules-path.component.html'
})
export class UploadedRulesPathComponent implements OnInit {

    _rulesPath: RulesPath[];
    _selectedRulesPath: RulesPath[] = [];
    _ruleProviders: RuleProviderEntity[] = [];
    _ruleProviderRulesPathMap = new Map<RuleProviderEntity, RulesPath>();

    @Output() onSelectionChange = new EventEmitter<RulesPath[]>();
    @Output() onAddRulesPathRequest = new EventEmitter<boolean>();
    @Output() onDeleteRulesPathRequest = new EventEmitter<RulesPath>();

    @ViewChild('shortPathTemplate') shortPathTemplate: TemplateRef<any>;
    @ViewChild('sourceTargetTemplate') sourceTargetTemplate: TemplateRef<any>;
    @ViewChild('rulesTemplate') rulesTemplate: TemplateRef<any>;
    @ViewChild('actionsTemplate') actionsTemplate: TemplateRef<any>;

    sourceQueries: FilterQuery[] = [];
    targetQueries: FilterQuery[] = [];

    rows: RuleProviderEntity[];
    allRows: RuleProviderEntity[];
    filteredRows: RuleProviderEntity[];
    selectedRows: RuleProviderEntity[] = [];

    columns: any[];

    tableConfig: TableConfig;
    filterConfig: FilterConfig = {
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
        title: 'No custom rules available'
    } as EmptyStateConfig;

    paginationConfig: PaginationConfig = {
        pageNumber: 1,
        pageSize: 5,
        pageSizeIncrements: [3, 5, 10],
        totalItems: 0
    } as PaginationConfig;

    dataTableConfig: NgxDataTableConfig = {
        columnMode: 'flex',
        rowClass: (row: RuleProviderEntity) => {
            return row.loadError ? 'row-danger' : 'row-success';
        }
    } as NgxDataTableConfig;;

    isAscendingSort: boolean = true;

    private bsModalRef: BsModalRef;

    constructor(
        private _ruleService: RuleService,
        private _modalService: BsModalService
    ) { }

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

        this.tableConfig = {
            emptyStateConfig: this.emptyStateConfig,
            paginationConfig: this.paginationConfig,
            showCheckbox: true,
            toolbarConfig: this.toolbarConfig
        } as TableConfig;
    }

    @Input()
    set rulesPath(rulesPath: RulesPath[]) {
        if (rulesPath !== undefined && rulesPath != null) {
            this._rulesPath = rulesPath;
            this._ruleProviderRulesPathMap.clear();

            if (this._rulesPath.length == 0) {
                this._ruleProviders = [];
                this.initTable();
            } else {
                const ruleProviders: Observable<RuleProviderEntity[]>[] = this._rulesPath.map((rulePath: RulesPath) => {
                    return this._ruleService.getByRulesPath(rulePath).pipe(
                        tap((ruleProviders: RuleProviderEntity[]) => {
                            ruleProviders.forEach((provider: RuleProviderEntity) => {
                                this._ruleProviderRulesPathMap.set(provider, rulePath);
                            });
                        })
                    );
                });
                forkJoin(ruleProviders).pipe(
                    map((ruleProviders: RuleProviderEntity[][]) => {
                        let result: RuleProviderEntity[] = [];
                        for (var i = 0; i < ruleProviders.length; i++) {
                            result = result.concat(ruleProviders[i]);
                        }
                        return result;
                    })
                ).subscribe((ruleProviders: RuleProviderEntity[]) => {
                    this._ruleProviders = ruleProviders;
                    this.initTable();
                });
            }
        }
    }

    @Input()
    set initialSelectedRows(initialSelectedRows: RulesPath[]) {
        if (initialSelectedRows !== undefined && initialSelectedRows != null) {
            this._selectedRulesPath = initialSelectedRows;
            this.initTable();
        }
    }

    initTable() {
        this.selectedRows = [];
        if (this._selectedRulesPath) {
            this._ruleProviders.forEach((ruleProvider: RuleProviderEntity) => {
                const rulesPath: RulesPath = this._ruleProviderRulesPathMap.get(ruleProvider);

                var indexOfRow = this._selectedRulesPath.findIndex(r => r.id === rulesPath.id);
                if (indexOfRow >= 0) {
                    (<any>ruleProvider).selected = true;
                    this.selectedRows.push(ruleProvider);
                } else {
                    (<any>ruleProvider).selected = false;
                }
            });
        }

        this.allRows = this._ruleProviders;
        this.filteredRows = this.allRows;

        this.updateRows(false); // Reinitialize expanded rows in order to render properly with tabs
        this.loadQueryFilters();
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

        const sourceIndex = (this.filterConfig.fields).findIndex((i) => i.id === 'source');
        const targetIndex = (this.filterConfig.fields).findIndex((i) => i.id === 'target');

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

    matchesFilters(item: RuleProviderEntity, filters: Filter[]): boolean {
        let matches = true;
        filters.forEach((filter) => {
            if (!this.matchesFilter(item, filter)) {
                matches = false;
                return matches;
            }
        });
        return matches;
    }

    matchesFilter(item: RuleProviderEntity, filter: Filter): boolean {
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
        const index = (this.filterConfig.fields).findIndex((i) => i.id === $event.field.id);
        let val = $event.value.trim();

        if (this.filterConfig.fields[index].id === 'source') {
            this.filterConfig.fields[index].queries = [
                ...this.sourceQueries.filter((item: FilterQuery) => {
                    if (item.value) {
                        return (item.value.toLowerCase().indexOf(val.toLowerCase()) > -1);
                    } else {
                        return true;
                    }
                })
            ];
        } else if (this.filterConfig.fields[index].id === 'target') {
            this.filterConfig.fields[index].queries = [
                ...this.targetQueries.filter((item: FilterQuery) => {
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
        rows.forEach((row: RuleProviderEntity) => {
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
        const rulesPath: RulesPath[] = this.selectedRows.map((row: RuleProviderEntity) => {
            return this._ruleProviderRulesPathMap.get(row);
        });
        this.onSelectionChange.emit(rulesPath);
    }

}
