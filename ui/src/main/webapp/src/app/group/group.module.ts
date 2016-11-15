import {NgModule} from "@angular/core";
import {HttpModule, RequestOptions, XHRBackend, Http} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import "rxjs/Rx";
import {GroupListComponent} from "./grouplist.component";
import {AnalysisContextFormComponent} from "./analysiscontextform.component";
import {AddRulesPathModalComponent} from "./add-rules-path-modal.component";
import {AnalysisContextAdvancedOptionsModalComponent} from "./analysis-context-advanced-options-modal.component";
import {ApplicationGroupForm} from "./applicationgroupform.component";
import {ConfigurationComponent} from "./configuration.component";
import {CustomRuleSelectionComponent} from "./custom-rule-selection.component";
import {RulesModalComponent} from "./rules-modal.component";
import {EditApplicationFormComponent} from "./application/edit-application-form.component";
import {RegisterApplicationFormComponent} from "./application/registerapplicationform.component";
import {FileService} from "./application/file.service";
import {FileExistsValidator} from "./application/file-exists.validator";
import {RegisteredApplicationService} from "./application/registeredapplication.service";
import {AnalysisContextService} from "./analysiscontext.service";
import {ApplicationGroupResolve} from "./application-group.resolve";
import {ApplicationGroupService} from "./applicationgroup.service";
import {ConfigurationService} from "./configuration.service";
import {RuleService} from "./rule.service";
import {WindupService} from "./windup.service";
import {GroupRoutingModule} from "./group-routing.module";
import {SharedModule} from "../shared/shared.module";
import {ReportsModule} from "../reports/reports.module";
import {TechnologyComponent} from "./technology.component";
import {FileUploadModule, FileUploader} from "ng2-file-upload";
import {MigrationPathService} from "../services/migrationpath.service";
import {ConfigurationOptionsService} from "./configuration-options.service";
import {PackageRegistryService} from "../services/package-registry.service";



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        GroupRoutingModule,
        SharedModule,
        ReportsModule,
        FileUploadModule
    ],
    declarations: [
        GroupListComponent,
        AnalysisContextFormComponent,
        AnalysisContextAdvancedOptionsModalComponent,
        AddRulesPathModalComponent,
        ApplicationGroupForm,
        ConfigurationComponent,
        CustomRuleSelectionComponent,
        GroupListComponent,
        RulesModalComponent,
        EditApplicationFormComponent,
        RegisterApplicationFormComponent,
        TechnologyComponent
    ],
    providers: [
        FileService,
        FileExistsValidator,
        RegisteredApplicationService,
        AnalysisContextService,
        ApplicationGroupResolve,
        ApplicationGroupService,
        ConfigurationService,
        RuleService,
        WindupService,
        MigrationPathService,
        ConfigurationOptionsService,
        PackageRegistryService,
        {
            provide: FileUploader,
            useValue: new FileUploader({})
        }
    ]
})
export class GroupModule {
}
