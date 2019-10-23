import {NgModule} from "@angular/core";
import {AnalysisContextService} from "./analysis-context.service";
import {AnalysisContextFormComponent} from "./analysis-context-form.component";
import {MigrationPathService} from "./migration-path.service";
import {PackageRegistryService} from "./package-registry.service";
import {AnalysisContextAdvancedOptionsModalComponent} from "./analysis-context-advanced-options-modal.component";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import {SelectApplicationsComponent} from "./select-applications.component";
import {TransformationPathsComponent} from "./transformation-paths.component";
import {SelectPackagesComponent} from "./select-packages/select-packages.component";
import {SelectPackagesWrapperComponent} from "./select-packages/select-packages-wrapper.component";
import {SelectPackagesSummaryComponent} from "./select-packages/select-packages-summary.component";
import {TableModule} from "patternfly-ng/table";
import {ListModule} from "patternfly-ng/list";
import {ToolbarModule} from "patternfly-ng/toolbar";
import {ActionModule} from "patternfly-ng/action";
import {TabsModule, TabsetConfig} from "ngx-bootstrap/tabs";
import {ModalModule} from "ngx-bootstrap/modal";

import {CustomRulesComponent} from "./custom-rules/custom-rules.component";
import {UploadedRulesPathComponent} from "./custom-rules/uploaded-rules-path.component";
import {ServerPathRulesComponent} from "./custom-rules/server-path-rules.component";
import {UploadedRulePathModalComponent} from "./custom-rules/uploaded-rule-path-modal.component";
import {ServerPathRulesModalComponent} from "./custom-rules/server-path-rules-modal.component";
import {RulesListComponent} from "./custom-rules/rules-list.component";
import {RulesComponent} from "./custom-rules/rules.component";

import { CustomLabelsComponent } from "./custom-labels/custom-labels.component";
import { UploadedLabelsPathComponent } from "./custom-labels/uploaded-labels-path.component";
import { ServerPathLabelsComponent } from "./custom-labels/server-path-labels.component";
import { UploadedLabelPathModalComponent } from "./custom-labels/uploaded-label-path-modal.component";
import { ServerPathLabelsModalComponent } from "./custom-labels/server-path-labels-modal.component";
import { LabelsListComponent } from "./custom-labels/labels-list.component";
import { LabelsComponent } from "./custom-labels/labels.component";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([]),
        TableModule,
        ListModule,
        ToolbarModule,
        ActionModule,
        TabsModule,
        ModalModule
    ],
    declarations: [
        AnalysisContextFormComponent,
        AnalysisContextAdvancedOptionsModalComponent,
        SelectApplicationsComponent,
        TransformationPathsComponent,

        SelectPackagesComponent,
        SelectPackagesWrapperComponent,
        SelectPackagesSummaryComponent,

        CustomRulesComponent,
        UploadedRulesPathComponent,
        ServerPathRulesComponent,
        UploadedRulePathModalComponent,
        ServerPathRulesModalComponent,
        RulesListComponent,
        RulesComponent,

        CustomLabelsComponent,
        UploadedLabelsPathComponent,
        ServerPathLabelsComponent,
        UploadedLabelPathModalComponent,
        ServerPathLabelsModalComponent,
        LabelsListComponent,
        LabelsComponent
    ],
    exports: [
        AnalysisContextFormComponent,
        AnalysisContextAdvancedOptionsModalComponent,
        SelectApplicationsComponent,
        TransformationPathsComponent,

        SelectPackagesComponent,
        SelectPackagesWrapperComponent,
        SelectPackagesSummaryComponent,

        RulesListComponent,
        RulesComponent,

        LabelsListComponent,
        LabelsComponent
    ],
    providers: [
        AnalysisContextService,
        MigrationPathService,
        PackageRegistryService,
        TabsetConfig
    ],
    entryComponents: [
        UploadedRulePathModalComponent,
        ServerPathRulesModalComponent,

        UploadedLabelPathModalComponent,
        ServerPathLabelsModalComponent
    ]
})
export class AnalysisContextModule {
}