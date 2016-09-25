import {Component, OnInit, ViewChild} from "@angular/core";
import {ConfigurationService} from "../services/configuration.service";
import {Configuration} from "windup-services";
import {RuleService} from "../services/rule.service";
import {RuleProviderEntity} from "windup-services";
import {RulesModalComponent} from "./rules-modal.component";
import {RulesPath} from "windup-services";
import {AddRulesPathModalComponent, ConfigurationEvent} from "./add-rules-path-modal.component";

@Component({
    selector: 'application-list',
    templateUrl: './configuration.component.html'
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
        private _configurationService:ConfigurationService,
        private _ruleService:RuleService
    ) {}

    ngOnInit(): void {
        this._configurationService.get().subscribe(
            (configuration:Configuration) => {
                this.configuration = configuration;
                this.loadProviders();
            },
            error => this.errorMessage = <any>error
        );
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
}
