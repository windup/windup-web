import { Component, ViewChild, TemplateRef, Input, OnDestroy } from '@angular/core';
import { TableConfig } from 'patternfly-ng/table';
import { PaginationConfig, PaginationEvent } from 'patternfly-ng/pagination';
import { EmptyStateConfig } from 'patternfly-ng/empty-state';
import { ActionConfig, Action } from 'patternfly-ng/action';
import { RulesPath, RuleProviderEntity } from '../../generated/windup-services';
import { ConfigurationService } from '../../configuration/configuration.service';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { map, flatMap, filter } from 'rxjs/operators';
import { RuleService } from '../../configuration/rule.service';
import { ToolbarConfig } from 'patternfly-ng/toolbar/toolbar-config';
import { SortConfig } from 'patternfly-ng/sort';
import { FilterConfig, FilterField, FilterType, FilterEvent, Filter } from 'patternfly-ng/filter';
import { getAvailableFilters } from '../../configuration/technology-filter';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SingleFileRuleContentModalComponent } from './single-file-rule-content-modal.component';

@Component({
    selector: 'wu-custom-rule-selection-card',
    templateUrl: './custom-rule-selection-card.component.html',
    styleUrls: ['./custom-rule-selection-card.component.scss']
})
export class CustomRuleSelectionCardComponent implements OnDestroy {

    bsModalRef: BsModalRef;

    @ViewChild('idTemplate') idTemplate: TemplateRef<any>;
    @ViewChild('sourceTargetTemplate') sourceTargetTemplate: TemplateRef<any>;
    @ViewChild('rulesTemplate') rulesTemplate: TemplateRef<any>;
    @ViewChild('showTemplate') showTemplate: TemplateRef<any>;

    allRows: RuleProviderEntity[] = [];
    filteredRows: RuleProviderEntity[] = [];

    rows: RuleProviderEntity[];
    columns: any[];

    sortConfig: SortConfig;
    tableConfig: TableConfig;
    filterConfig: FilterConfig;
    actionConfig: ActionConfig;
    toolbarConfig: ToolbarConfig;
    emptyStateConfig: EmptyStateConfig;
    paginationConfig: PaginationConfig;

    isAscendingSort: boolean = true;

    selectedRows: RuleProviderEntity[] = [];

    private sourceQueries: any[] = [];
    private targetQueries: any[] = [];

    private subscriptions: Subscription[] = [];

    constructor(
        private _ruleService: RuleService,
        private _configurationService: ConfigurationService,
        private modalService: BsModalService
    ) {
        this.subscriptions.push(
            this._configurationService.getCustomRulesetPaths().pipe(
                map((rulesPaths: RulesPath[]) => {
                    // Filter just rulePaths with shortPath
                    return rulesPaths.filter((rp) => rp.shortPath);
                }),
                map((rulesPaths: RulesPath[]) => {
                    return rulesPaths.map((rulePath: RulesPath) => this._ruleService.getByRulesPath(rulePath));
                }),
                flatMap((rulesPaths: Observable<RuleProviderEntity[]>[]) => {
                    return forkJoin(rulesPaths);
                })
            ).subscribe((ruleProviders: RuleProviderEntity[][]) => {
                let rules: RuleProviderEntity[] = [];
                for (var i = 0; i < ruleProviders.length; i++) {
                    rules = rules.concat(ruleProviders[i]);
                }

                this.allRows = rules;
                this.filteredRows = this.allRows;
                this.updateRows(false); // Reinitialize expanded rows in order to render properly with tabs

                this.loadQueryFilters();
            })
        );
    }

    ngAfterViewInit(): void {
        this.updateRows(false); // Reinitialize expanded rows in order to render properly with tabs
    }

    ngOnInit(): void {
        this.columns = [{
            cellTemplate: this.idTemplate,
            draggable: false,
            prop: 'providerID',
            name: 'Provider ID',
            resizeable: false,
            sortable: false,
            // width: 40
        }, {
            cellTemplate: this.sourceTargetTemplate,
            draggable: false,
            prop: 'sources',
            name: 'Source / Target',
            resizeable: false,
            sortable: false,
            // width: 40
        }, {
            cellTemplate: this.rulesTemplate,
            draggable: false,
            prop: 'rules',
            name: '# Rules',
            resizeable: true,
            sortable: false,
            cellClass: 'text-center-override'
        }, {
            cellTemplate: this.showTemplate,
            draggable: false,
            prop: 'id',
            name: '',
            resizeable: false,
            sortable: false,
            cellClass: 'text-center-override'
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
                primaryActions: [{
                    id: 'addCustomRule',
                    title: 'Add Rule',
                    tooltip: 'Add custom rule'
                }],
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

        this.sortConfig = {
            fields: [{
                id: 'providerID',
                title: 'ProviderID',
                sortType: 'alpha'
            }],
            isAscending: this.isAscendingSort
        } as SortConfig;

        this.actionConfig = {
            primaryActions: [{
                id: 'addRule',
                title: 'Add',
                tooltip: 'Add rule',
                styleClass: 'btn-primary'
            }, {
                id: 'selectAll',
                title: 'Select all >>',
                tooltip: 'Select all rules'
            }],
            moreActions: []
        } as ActionConfig;

        this.toolbarConfig = {
            actionConfig: this.actionConfig,
            filterConfig: this.filterConfig,
            // sortConfig: this.sortConfig
        } as ToolbarConfig;

        this.tableConfig = {
            emptyStateConfig: this.emptyStateConfig,
            paginationConfig: this.paginationConfig,
            showCheckbox: false,
            toolbarConfig: this.toolbarConfig
        } as TableConfig;
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subs) => subs.unsubscribe());
    }

    loadQueryFilters() {
        this.sourceQueries = getAvailableFilters(this.allRows, 'sources').map((elem) => {
            // console.log(elem.value);
            elem.value = elem.name;
            // let a = Object.assign(String.prototype, { toString: () => elem.value.name }, elem.value);
            return elem;
        });

        this.targetQueries = getAvailableFilters(this.allRows, 'targets').map((elem) => {
            elem.value = elem.name;
            return elem;
        });

        const sourceIndex = (this.filterConfig.fields as any).findIndex((i: any) => i.id === 'source');
        const targetIndex = (this.filterConfig.fields as any).findIndex((i: any) => i.id === 'target');

        this.filterConfig.fields[sourceIndex].queries = [...this.sourceQueries];
        this.filterConfig.fields[targetIndex].queries = [...this.targetQueries];
    }

    // Filter

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
            match = (<any>filter.query).callback(item);
        } else if (filter.field.id === 'target') {
            match = (<any>filter.query).callback(item);
        }
        return match;
    }

    // Actions

    handleAction(action: Action): void {
        console.log(action);
        if (action.id == 'selectAll') {
            this.selectedRows = this.rows;
        }
    }

    // Handle filter changes
    filterChanged($event: FilterEvent): void {
        this.applyFilters($event.appliedFilters);
        this.filterFieldSelected($event);
    }

    // Reset filtered queries
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

    // Filter queries for type ahead
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

    // Modal

    openModal(template: TemplateRef<any>) {
        this.bsModalRef = this.modalService.show(SingleFileRuleContentModalComponent);
    }
}
