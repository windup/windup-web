import {NgModule} from "@angular/core";
import {ConfigurationComponent} from "./configuration.component";
import {RulesModalComponent} from "./rules-modal.component";
import {ConfigurationResolve} from "./configuration.resolve";
import {ConfigurationService} from "./configuration.service";
import {ConfigurationOptionsService} from "./configuration-options.service";
import {RuleService} from "./rule.service";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([])
    ],
    declarations: [
        ConfigurationComponent,
        RulesModalComponent
    ],
    exports: [
        ConfigurationComponent,
        RulesModalComponent
    ],
    providers: [
        ConfigurationResolve,
        ConfigurationService,
        ConfigurationOptionsService,
        RuleService
    ]
})
export class ConfigurationModule {
}
