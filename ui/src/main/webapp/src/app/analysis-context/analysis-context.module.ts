import {NgModule} from "@angular/core";
import {AnalysisContextService} from "./analysis-context.service";
import {AnalysisContextFormComponent} from "./analysis-context-form.component";
import {CustomRuleSelectionComponent} from "./custom-rule-selection.component";
import {MigrationPathService} from "./migration-path.service";
import {PackageRegistryService} from "./package-registry.service";
import {AnalysisContextAdvancedOptionsModalComponent} from "./analysis-context-advanced-options-modal.component";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import {SelectApplicationsComponent} from "./select-applications.component";
import {CustomRuleSelectionCardComponent} from "./custom-rule-selection-card/custom-rule-selection-card.component";
import {TableModule} from "patternfly-ng/table";
import {TechnologyTextComponent} from "./custom-rule-selection-card/technology-text.component";
import {TabsModule, TabsetConfig} from "ngx-bootstrap/tabs";
import {ModalModule} from "ngx-bootstrap/modal";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([]),
        TableModule,
        TabsModule,
        ModalModule
    ],
    declarations: [
        AnalysisContextFormComponent,
        AnalysisContextAdvancedOptionsModalComponent,
        CustomRuleSelectionComponent,
        SelectApplicationsComponent,
        CustomRuleSelectionCardComponent,
        TechnologyTextComponent
    ],
    exports: [
        AnalysisContextFormComponent,
        AnalysisContextAdvancedOptionsModalComponent,
        CustomRuleSelectionComponent,
        SelectApplicationsComponent,
        CustomRuleSelectionCardComponent,
        TechnologyTextComponent
    ],
    providers: [
        AnalysisContextService,
        MigrationPathService,
        PackageRegistryService,
        TabsetConfig
    ]
})
export class AnalysisContextModule {
}
