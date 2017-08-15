import {AfterViewInit, Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {ConfigurationService} from "./configuration.service";
import {Configuration, RuleProviderEntity, RulesPath, Technology} from "../generated/windup-services";
import {RuleService} from "./rule.service";
import {RulesModalComponent} from "./rules-modal.component";
import {AddRulesPathModalComponent, ConfigurationEvent} from "./add-rules-path-modal.component";
import {ActivatedRoute} from "@angular/router";
import {NotificationService} from "../core/notification/notification.service";
import {utils} from "../shared/utils";
import {ConfirmationModalComponent} from "../shared/dialog/confirmation-modal.component";
import {OrderDirection, SortingService} from "../shared/sort/sorting.service";
import Arrays = utils.Arrays;
import {FilterConfiguration} from "../shared/toolbar/toolbar.component";
import {getAvailableFilters} from "./technology-filter";
import {DomSanitizer} from '@angular/platform-browser';

declare function prettyPrint();

@Component({
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit, AfterViewInit {

    forceReloadAttempted: boolean = false;
    rescanInProgress: boolean = false;

    errorMessage: string;
    configuration: Configuration;

    ruleProvidersByPath: Map<RulesPath, RuleProviderEntity[]> = new Map<RulesPath, RuleProviderEntity[]>();

    @ViewChild(RulesModalComponent)
    rulesModalComponent: RulesModalComponent;

    @ViewChild(AddRulesPathModalComponent)
    addRulesModalComponent: AddRulesPathModalComponent;

    @ViewChild('removeRulesConfirmationModal')
    removeRulesConfirmationModal: ConfirmationModalComponent;

    sort = {
        sortOptions: [
            { name: 'Name', field: 'providerID' },
            { name: 'Number of rules', field: (provider: RuleProviderEntity) => provider.rules ? provider.rules.length : 0 },
        ],
        selectedOption: { name: 'Name', field: 'providerID' },
        direction: OrderDirection.ASC
    };

    filter: FilterConfiguration = {
        filterableAttributes: ['source', 'target'],
        selectedAttribute: 'source',
        filterOptions: [],
        selectedFilters: [],
        countFilteredItems: 0,
        getLabel: filter => `${filter.field}: ${filter.name}`
    };

    showAllRules: false;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _configurationService: ConfigurationService,
        private _ruleService: RuleService,
        private _notificationService: NotificationService,
        private _sortingService: SortingService<RuleProviderEntity>,
        private _element: ElementRef,
        private _sanitizer: DomSanitizer
    ) {

    }

    ngOnInit(): void {
        this._activatedRoute.data.subscribe((data: {configuration: Configuration}) => {
            this.configuration = data.configuration;
            this.loadProviders();
        });
    }

    ngAfterViewInit(): void {
        this.removeRulesConfirmationModal.confirmed.subscribe(rulePath => this.removeRulesPath(rulePath));
    }

    loadProviders() {
        if (!this.configuration || this.configuration.rulesPaths == null)
            return;

        this.loadRuleProviderDetails();
    }

    forceReload() {
        this.forceReloadAttempted = true;
        this.rescanInProgress = true;
        this._configurationService.reloadConfigration().subscribe(() => {
            this.rescanInProgress = false;
            this.loadRuleProviderDetails()
        });
    }

    loadRuleProviderDetails() {
        this.configuration.rulesPaths.forEach((rulesPath) => {
            this._ruleService.getByRulesPath(rulesPath).subscribe(
                (ruleProviders:RuleProviderEntity[]) => {
                    this.ruleProvidersByPath.set(rulesPath, ruleProviders);
                    if (!this.forceReloadAttempted && rulesPath.rulesPathType == "SYSTEM_PROVIDED" && ruleProviders.length == 0) // needs to be loaded
                        this.forceReload();
                    this.updateFilters();
                },
                error => this.errorMessage = <any>error
            );
        });
    }

    get sortedPaths() {
        if (!this.configuration || this.configuration.rulesPaths == null)
            return null;

        return this.configuration.rulesPaths.sort((a, b) => {
            if (a.rulesPathType == b.rulesPathType)
                return 0;
            else if (a.rulesPathType == "SYSTEM_PROVIDED" && b.rulesPathType == "USER_PROVIDED")
                return 1;
            else if (a.rulesPathType == "USER_PROVIDED" && b.rulesPathType == "SYSTEM_PROVIDED")
                return -1;
        });
    }

    rulesShortPath(rulePath:RulesPath): string {
        if (rulePath.rulesPathType == "SYSTEM_PROVIDED")
            return "<System Rules>";
        else if (rulePath.shortPath)
            return rulePath.shortPath;
        else
            return rulePath.path;
    }

    areRulesLoaded(rulesPath:RulesPath) {
        return this.ruleProvidersByPath.has(rulesPath);
    }

    hasFileBasedProviders(rulesPath:RulesPath) {
        let providers = this.ruleProvidersByPath.get(rulesPath);
        if (!providers)
            return false;

        let foundRules = false;
        providers.forEach((provider) => {
            if (this.isFileBasedProvider(provider))
                foundRules = true;
        });
        return foundRules;
    }

    isFileBasedProvider(provider:RuleProviderEntity) {
        switch (provider.ruleProviderType) {
            case "GROOVY":
            case "XML":
                return true;
            default:
                return false;
        }
    }

    displayRules(provider:RuleProviderEntity, event:Event) {
        event.preventDefault();
        this.rulesModalComponent.ruleProviderEntity = provider;
        this.rulesModalComponent.show();
    }

    displayAddRulesPathForm() {
        this.addRulesModalComponent.show();
    }

    configurationUpdated(event: ConfigurationEvent) {
        this.configuration = event.configuration;
        this.loadProviders();
    }

    removeRulesPath(rulesPath: RulesPath) {
        this._ruleService.deleteRule(rulesPath).subscribe(() => {
            this._notificationService.success('Rule was deleted');

            this._configurationService.get().subscribe(newConfig => {
                this.configuration = newConfig;
                this.loadProviders();
            });
        });
    }

    reloadConfiguration() {
        this._configurationService.reloadConfigration().subscribe(
            configuration => {
                this.configuration = configuration;
                this.loadProviders();

                this._notificationService.success('Configuration was reloaded');
            },
            error => this._notificationService.error(utils.getErrorMessage(error))
        );
    }

    confirmRemoveRules(rulesPath: RulesPath) {
        console.log("Checking rules path " + rulesPath.path);
        this._ruleService.checkIfUsedRulesPath(rulesPath).subscribe(
            response => {
                if (response.valueOf())
                {
                    this._notificationService.warning(`The rules path '${rulesPath.path}' is used in an existing Analysis Context and cannot be removed.`);
                } 
                else 
                {
                    this.removeRulesConfirmationModal.body = `Are you sure you want to remove the rules from '${rulesPath.path}'?`;
                    this.removeRulesConfirmationModal.data = rulesPath;
                    this.removeRulesConfirmationModal.show();
                }
            }
        );
    }        

    removeFilters() {
        this.filter.selectedFilters = [];
        this.filter = Object.assign({}, this.filter);
    }

    updateFilters() {
        const allRuleProviders = Arrays.flatMap(this.configuration.rulesPaths, path => this.getRuleProvidersByPath(path));
        this.filter.countFilteredItems = this.configuration.rulesPaths.map(path => this.getFilteredRuleProvidersByPath(path))
            .reduce((sum, providers) => sum + providers.length, 0);

        this.filter.filterOptions = getAvailableFilters(allRuleProviders, <any>(this.filter.selectedAttribute + 's'));
        this.filter = Object.assign({}, this.filter);
    }

    getOnlyMigrationRules(path: RulesPath) {
        const ruleProviders = this.ruleProvidersByPath.get(path) || [];

        if (this.showAllRules) {
            return ruleProviders;
        }

        return ruleProviders.filter(provider => {
            return provider.phase === 'MIGRATIONRULESPHASE';
        });
    }

    getRuleProvidersByPath(path: RulesPath) {
        const ruleProviders = this.getOnlyMigrationRules(path);
        return this._sortingService.sort(ruleProviders);
    }

    getFilteredRuleProvidersByPath(path: RulesPath) {
        let filteredRuleProviders = this.getOnlyMigrationRules(path);

        this.filter.selectedFilters.forEach(filter => {
            filteredRuleProviders = filteredRuleProviders.filter((provider) => {
                return filter.callback(provider);
            });
        });

        return this._sortingService.sort(filteredRuleProviders);
    }

    updateSort() {
        this._sortingService.orderBy(this.sort.selectedOption.field, this.sort.direction);
    }

    isFilterActive() {
        return this.filter.selectedFilters.length > 0;
    }

    clickHeader(event:Event, provider:RuleProviderEntity) {
        if(!$(event.target).is("button, a, input, .fa-ellipsis-v")){
            $(this._element.nativeElement).find("#span-" + provider.id).toggleClass("fa-angle-down")
                .end().parent().toggleClass("list-view-pf-expand-active")
                .find("#container-" + provider.id).toggleClass("hidden").end().parent()
                .find("#group-item-" + provider.id).toggleClass("selectedRuleHeader");
            prettyPrint();
        }
    }

    scrollToRule(id:number) {
        this.scrollToElement(this._element.nativeElement.querySelector(`h4[id="${id}"]`));
    }

    scrollToRuleSetHeader(id:number) {
        $(this._element.nativeElement).find("#select-" + id).val('');
        this.scrollToElement(this._element.nativeElement.querySelector(`div[id="group-item-${id}"]`));
    }

    private scrollToElement(element:Element) {
        if (element) {
            /*
             * For reference on how the offset is computed:
             * https://developer.mozilla.org/en/docs/Web/API/Element/getBoundingClientRect
             *
             * 60 is the height in px of the top nav bar "header-logo-wrapper"
             * */
            let offset = element.getBoundingClientRect().top + window.scrollY - 60;
            window.scrollTo(0, offset);
        }
    }

    getRuleProviderMarginTop(ruleProvider: RuleProviderEntity) {
        let margin = 0;
        if (ruleProvider.sources.length > 0) {
            if (ruleProvider.targets.length > 0) {
                margin = 14;
            } else {
                margin = 7;
            }
        } else if (ruleProvider.targets.length > 0) {
            margin = 7;
        }
        return margin;
    }

    getLabelForRuleID(ruleID: string, providerID: string, i:number) {
        return (ruleID.length > 0 ? ruleID : providerID + "_" + (i + 1));
    }

}
