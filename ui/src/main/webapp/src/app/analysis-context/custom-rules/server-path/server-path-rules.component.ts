import { Component, Input, EventEmitter, Output, TemplateRef, AfterContentInit, Renderer2, ElementRef, AfterViewInit, AfterViewChecked, OnInit, OnChanges, DoCheck } from "@angular/core";
import { Action, ActionConfig } from "patternfly-ng/action";
import { ListEvent, ListConfig } from "patternfly-ng/list";
import { EmptyStateConfig } from "patternfly-ng/empty-state";
import { cloneDeep } from 'lodash';
import { RulesPath, RuleProviderEntity } from "../../../generated/windup-services";
import { ToolbarConfig } from "patternfly-ng/toolbar";
import { FilterEvent, Filter, FilterField, FilterConfig, FilterType } from "patternfly-ng/filter";
import { RuleService } from "../../../configuration/rule.service";
import { ModalOptions, BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ServerPathRulesModalComponent } from "./modal/server-path-rules-modal.component";

@Component({
    selector: 'wu-server-path-rules',
    templateUrl: './server-path-rules.component.html',
    styleUrls: ['./server-path-rules.component.scss']
})
export class ServerPathRulesComponent implements DoCheck {

    _rulesPath: RulesPath[];

    @Output() onSelectionChange = new EventEmitter<RulesPath[]>();
    @Output() onAddRulesPathRequest = new EventEmitter<boolean>();
    @Output() onDeleteRulesPathRequest = new EventEmitter<RulesPath>();

    items: RulesPath[] = [];
    allItems: RulesPath[] = [];
    selectedItems: RulesPath[] = [];

    ruleProviders = new Map<number, RuleProviderEntity[]>();

    _initialSelectedRows: RulesPath[];

    // Toolbar config

    toolbarConfig: ToolbarConfig;
    toolbarActionConfig: ActionConfig;
    toolbarFilterConfig: FilterConfig;

    toolbarNameQueries: any[];

    // List view config

    listConfig: ListConfig;
    listActionConfig: ActionConfig;
    listSelectType: string = 'checkbox';
    listEmptyStateConfig: EmptyStateConfig;

    private bsModalRef: BsModalRef;

    constructor(
        private _ruleService: RuleService,
        private _modalService: BsModalService
    ) {
    }

    ngDoCheck() {
        $('#serverPathRulesList .btn-danger').removeClass('btn-default');
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
                id: 'addRule',
                title: 'Add',
                tooltip: 'Add custom rule',
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
            title: 'No custom rules available'
        } as EmptyStateConfig;

        this.listActionConfig = {
            primaryActions: [{
                id: 'view',
                title: 'View',
                tooltip: 'View'
            }, {
                id: 'delete',
                title: 'Delete',
                tooltip: 'Delete server rule path',
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
    set rulesPath(rulesPath: RulesPath[]) {
        if (rulesPath !== undefined && rulesPath != null) {
            this._rulesPath = rulesPath;
            this.loadRulesPath();
            this.initList();
        }
    }

    @Input()
    set initialSelectedRows(initialSelectedRows: RulesPath[]) {
        this._initialSelectedRows = initialSelectedRows;
        this.initList();
    }

    loadRulesPath() {
        this._rulesPath.forEach((rulePath: RulesPath) => {
            this._ruleService.getByRulesPath(rulePath).subscribe((rulesProvider: RuleProviderEntity[]) => {
                this.ruleProviders.set(rulePath.id, rulesProvider);
            });
        });

        this.allItems = this._rulesPath;
        this.items = cloneDeep(this.allItems);
    }

    getRulesProvider(item: RulesPath): RuleProviderEntity[] {
        return this.ruleProviders.get(item.id);
    }

    initList() {
        if (this._rulesPath !== undefined && this._rulesPath != null) {
            const rulesPath = [...this._rulesPath];

            if (this._initialSelectedRows && this._initialSelectedRows.length > 0) {
                rulesPath.forEach(ruleProvider => {
                    (<any>ruleProvider).selected = this._initialSelectedRows.some(p => p.id == ruleProvider.id);
                });
            } else {
                rulesPath.forEach(ruleProvider => {
                    (<any>ruleProvider).selected = false;
                });
            }

            this.allItems = rulesPath;
            this.items = this.allItems;
            // this.updateRows(true); // Reinitialize expanded rows in order to render properly with tabs
            // this.loadQueryFilters();
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

    matchesFilter(item: RulesPath, filter: Filter): boolean {
        let match = true;
        if (filter.field.id === 'name') {
            match = item.path.match(filter.value) !== null;
        }
        return match;
    }

    matchesFilters(item: RulesPath, filters: Filter[]): boolean {
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
        if (action.id == 'addRule') {
            this.onAddRulesPathRequest.emit(true);
        } else if (action.id == 'selectAll') {
            this.selectItems(this.allItems);
        }
    }

    handleListAction($event: Action, item: RulesPath): void {
        if ($event.id === 'delete' && item !== null) {
            this.onDeleteRulesPathRequest.emit(item);
        } else if ($event.id === 'view' && item !== null) {
            this.openRulePathModal(item);
        }
    }

    handleListSelectionChange($event: ListEvent): void {
        this.selectItems($event.selectedItems);
    }

    // Row selection

    // Modal

    /**
     * Opens a modal for showing the content of a RulePath
     */
    openRulePathModal(rulePath: RulesPath) {
        const config: ModalOptions = {
            class: 'modal-lg',
            initialState: {
                rulePath: rulePath,
                ruleProviders: this.getRulesProvider(rulePath)
            }
        };
        this.bsModalRef = this._modalService.show(ServerPathRulesModalComponent, config);
    }

    //

    selectItems(items: RulesPath[]) {
        this.selectedItems = items;
        this.onSelectionChange.emit(this.selectedItems);
    }
}

