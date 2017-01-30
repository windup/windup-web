import {Component, OnInit, ViewChild} from "@angular/core";
import {ConfigurationService} from "../services/configuration.service";
import {Configuration, RuleProviderEntity, RulesPath} from "windup-services";
import {RuleService} from "../services/rule.service";
import {RulesModalComponent} from "./rules-modal.component";
import {AddRulesPathModalComponent, ConfigurationEvent} from "./add-rules-path-modal.component";
import {ActivatedRoute} from "@angular/router";
import {NotificationService} from "../core/notification/notification.service";
import {utils} from "../shared/utils";

@Component({
    templateUrl: './configuration.component.html',
    styles: [`
        .rulesList .techLabel {
            display: inline-block; border: 2px ridge white/*1px solid #9ed0f1*/; background-color:  #e0f7ff; padding: 0.1ex 0.4em; margin: 0.1ex 0.4ex 0;
        }
        .list-group-item:hover { background-color: rgb(222, 243, 255); }
        .rulesList .list-view-pf-body { flex-basis: 89%; }
        @media (min-width: 992px) { .rulesList .list-view-pf .list-group-item-heading { font-size: initial; } } /* Disable this weird rule from PF. */
        @media (min-width: 992px) {
            .rulesList .list-view-pf-additional-info { width: 12%; }
            .rulesList .list-view-pf-description     { width: 88%; }
        }
        @media (min-width: 992px) {
            .list-view-pf-additional-info { -ms-flex: 0 0 auto; flex: 0 0 auto; }
        }
    `]
})
export class ConfigurationComponent implements OnInit {

    errorMessage:string;
    configuration:Configuration;

    ruleProvidersByPath:Map<RulesPath, RuleProviderEntity[]> = new Map<RulesPath, RuleProviderEntity[]>();

    @ViewChild(RulesModalComponent)
    rulesModalComponent:RulesModalComponent;

    @ViewChild(AddRulesPathModalComponent)
    addRulesModalComponent:AddRulesPathModalComponent;

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
        newConfiguration.rulesPaths.splice(newConfiguration.rulesPaths.indexOf(rulesPath), 1);

        this._configurationService.save(newConfiguration).subscribe(
            configuration => {
                this.configuration = configuration;
                this.loadProviders();
            },
            error => console.log("Error: " + error)
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
}
