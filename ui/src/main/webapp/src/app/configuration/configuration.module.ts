import {NgModule} from "@angular/core";
import {AddRulesPathModalComponent} from "./add-rules-path-modal.component";
import {ConfigurationComponent} from "./configuration.component";
import {RulesModalComponent} from "./rules-modal.component";
import {ConfigurationResolve} from "./configuration.resolve";
import {ConfigurationService} from "./configuration.service";
import {ConfigurationOptionsService} from "./configuration-options.service";
import {RuleService} from "./rule.service";
import {TechnologyComponent} from "./technology.component";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([])
    ],
    declarations: [
        AddRulesPathModalComponent,
        ConfigurationComponent,
        RulesModalComponent,
        TechnologyComponent
    ],
    exports: [
        AddRulesPathModalComponent,
        ConfigurationComponent,
        RulesModalComponent,
        TechnologyComponent
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
