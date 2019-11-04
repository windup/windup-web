import {NgModule} from "@angular/core";
import {ConfigurationRules} from "./configuration-rules/configuration-rules.component";
import {RulesModalComponent} from "./rules-modal.component";
import {ConfigurationResolve} from "./configuration.resolve";
import {ProjectConfigurationResolve} from "./project-configuration.resolve";
import {ConfigurationService} from "./configuration.service";
import {ConfigurationOptionsService} from "./configuration-options.service";
import {RuleService} from "./rule.service";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import {RuleContentComponent} from "./configuration-rules/rule-content/rule-content.component";
import { RulesListComponent } from "./configuration-rules/rules-list/rules-list.component";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([])
    ],
    declarations: [
        ConfigurationRules,
        RulesModalComponent,
        RuleContentComponent,
        RulesListComponent
    ],
    exports: [
        ConfigurationRules,
        RulesModalComponent,
        RuleContentComponent,
        RulesListComponent
    ],
    providers: [
        ConfigurationResolve,
        ProjectConfigurationResolve,
        ConfigurationService,
        ConfigurationOptionsService,
        RuleService
    ]
})
export class ConfigurationModule {
}
