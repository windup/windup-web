import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {ConfigurationService} from "./configuration.service";
import {Configuration, RuleProviderEntity, RulesPath} from "windup-services";
import {RuleService} from "./rule.service";
import {RulesModalComponent} from "./rules-modal.component";
import {AddRulesPathModalComponent, ConfigurationEvent} from "./add-rules-path-modal.component";
import {ActivatedRoute} from "@angular/router";
import {NotificationService} from "../core/notification/notification.service";
import {utils} from "../shared/utils";
import {ConfirmationModalComponent} from "../shared/confirmation-modal.component";

@Component({
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit, AfterViewInit {

    errorMessage:string;
    configuration:Configuration;

    ruleProvidersByPath:Map<RulesPath, RuleProviderEntity[]> = new Map<RulesPath, RuleProviderEntity[]>();

    @ViewChild(RulesModalComponent)
    rulesModalComponent:RulesModalComponent;

    @ViewChild(AddRulesPathModalComponent)
    addRulesModalComponent:AddRulesPathModalComponent;

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

        this.configuration.rulesPaths.forEach((rulesPath) => {
            this._ruleService.getByRulesPath(rulesPath).subscribe(
                (ruleProviders:RuleProviderEntity[]) => this.ruleProvidersByPath.set(rulesPath, ruleProviders),
                error => this.errorMessage = <any>error
            );
        });
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
        this.removeRulesConfirmationModal.body = `Do you really want to remove the rules from '${rulesPath.path}'?`;
        this.removeRulesConfirmationModal.data = rulesPath;
        this.removeRulesConfirmationModal.show();
    }
}
