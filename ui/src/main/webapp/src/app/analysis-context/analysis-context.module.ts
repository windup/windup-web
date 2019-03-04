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
import {SelectPackagesComponent} from "./select-packages/select-packages.component";
import {SelectPackagesWrapperComponent} from "./select-packages/select-packages-wrapper.component";
import {SelectPackagesSummaryComponent} from "./select-packages/select-packages-summary.component";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([])
    ],
    declarations: [
        AnalysisContextFormComponent,
        AnalysisContextAdvancedOptionsModalComponent,
        CustomRuleSelectionComponent,
        SelectApplicationsComponent,

        SelectPackagesComponent,
        SelectPackagesWrapperComponent,
        SelectPackagesSummaryComponent
    ],
    exports: [
        AnalysisContextFormComponent,
        AnalysisContextAdvancedOptionsModalComponent,
        CustomRuleSelectionComponent,    
        SelectApplicationsComponent,

        SelectPackagesComponent,
        SelectPackagesWrapperComponent,
        SelectPackagesSummaryComponent
    ],
    providers: [
        AnalysisContextService,
        MigrationPathService,
        PackageRegistryService,
    ]
})
export class AnalysisContextModule {
}
