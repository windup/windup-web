import {NgModule} from "@angular/core";
import {ConfigurationComponent} from "./configuration.component";
import {GlobalLabelsComponent} from "./global-labels/global-labels.component";
import {RulesModalComponent} from "./rules-modal.component";
import {ConfigurationResolve} from "./configuration.resolve";
import {ProjectConfigurationResolve} from "./project-configuration.resolve";
import {ConfigurationService} from "./configuration.service";
import {ConfigurationOptionsService} from "./configuration-options.service";
import {RuleService} from "./rule.service";
import {LabelService} from "./label.service";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import {RulesComponent} from "./rules/rules.component";
import { RulesListComponent } from "./rules-list/rules-list.component";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([])
    ],
    declarations: [
        ConfigurationComponent,
        GlobalLabelsComponent,
        RulesModalComponent,
        RulesComponent,
        RulesListComponent
    ],
    exports: [
        ConfigurationComponent,
        GlobalLabelsComponent,
        RulesModalComponent,
        RulesComponent,
        RulesListComponent
    ],
    providers: [
        ConfigurationResolve,
        ProjectConfigurationResolve,
        ConfigurationService,
        ConfigurationOptionsService,
        RuleService,
        LabelService
    ]
})
export class ConfigurationModule {
}
