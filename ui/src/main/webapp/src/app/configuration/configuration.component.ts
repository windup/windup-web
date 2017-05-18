import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {ConfigurationService} from "./configuration.service";
import {Configuration, RuleProviderEntity, RulesPath} from "../generated/windup-services";
import {RuleService} from "./rule.service";
import {RulesModalComponent} from "./rules-modal.component";
import {AddRulesPathModalComponent, ConfigurationEvent} from "./add-rules-path-modal.component";
import {ActivatedRoute} from "@angular/router";
import {NotificationService} from "../core/notification/notification.service";
import {utils} from "../shared/utils";
import {ConfirmationModalComponent} from "../shared/dialog/confirmation-modal.component";

@Component({
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit, AfterViewInit {

    forceReloadAttempted: boolean = false;
    rescanInProgress: boolean= false;

    errorMessage: string;
    configuration: Configuration;

    ruleProvidersByPath: Map<RulesPath, RuleProviderEntity[]> = new Map<RulesPath, RuleProviderEntity[]>();

    @ViewChild(RulesModalComponent)
    rulesModalComponent: RulesModalComponent;

    @ViewChild(AddRulesPathModalComponent)
    addRulesModalComponent: AddRulesPathModalComponent;

    @ViewChild('removeRulesConfirmationModal')
    removeRulesConfirmationModal: ConfirmationModalComponent;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _configurationService:ConfigurationService,
        private _ruleService:RuleService,
        private _notificationService: NotificationService
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

    configurationUpdated(event:ConfigurationEvent) {
        this.configuration = event.configuration;
        this.loadProviders();
    }

    removeRulesPath(rulesPath:RulesPath) {
        let newConfiguration = JSON.parse(JSON.stringify(this.configuration));

        let index = newConfiguration.rulesPaths.findIndex(item => item.id === rulesPath.id);

        if (index === -1) {
            throw new Error('Rule path not found in configuration');
        }

        newConfiguration.rulesPaths.splice(index, 1);

        this._configurationService.save(newConfiguration).subscribe(
            configuration => {
                this.configuration = configuration;
                this.loadProviders();
            },
            error => console.error("Error: " + error)
        )
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
        this.removeRulesConfirmationModal.body = `Are you sure you want to remove the rules from '${rulesPath.path}'?`;
        this.removeRulesConfirmationModal.data = rulesPath;
        this.removeRulesConfirmationModal.show();
    }
}
