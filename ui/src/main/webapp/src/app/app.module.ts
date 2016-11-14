import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, RequestOptions, XHRBackend, Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import 'rxjs/Rx';

import {FileSelectDirective, FileDropDirective, FileUploader} from 'ng2-file-upload/ng2-file-upload';
import { AppComponent }  from './components/app.component';
import {routing, appRoutingProviders, appRoutes} from './app.routing';

import {ProjectListComponent} from "./project/projectlist.component";
import {AnalysisContextFormComponent} from "./group/analysiscontextform.component";
import {ApplicationGroupForm} from "./group/applicationgroupform.component";
import {GroupListComponent} from "./group/grouplist.component";
import {MigrationProjectFormComponent} from "./project/migrationprojectform.component";
import {RegisterApplicationFormComponent} from "./group/registerapplicationform.component";
import {ProgressBarComponent} from "./shared/progressbar.component";
import {NavbarComponent} from "./shared/navbar.component";
import {BreadCrumbsComponent} from "./shared/navigation/breadcrumbs.component";
import {ConfigurationService} from "./group/configuration.service";
import {AnalysisContextService} from "./group/analysiscontext.service";
import {ApplicationGroupService} from "./group/applicationgroup.service";
import {FileService} from "./group/file.service";
import {MigrationPathService} from "./services/migrationpath.service";
import {MigrationProjectService} from "./project/migrationproject.service";
import {RegisteredApplicationService} from "./group/registeredapplication.service";
import {WindupService} from "./group/windup.service";
import {RuleService} from "./group/rule.service";
import {ConfigurationComponent} from "./group/configuration.component";
import {TechnologyComponent} from "./components/technology.component";
import {RulesModalComponent} from "./group/rules-modal.component";
import {AddRulesPathModalComponent} from "./group/add-rules-path-modal.component";
import {ConfirmationModalComponent} from "./shared/confirmation-modal.component";
import {CustomRuleSelectionComponent} from "./group/custom-rule-selection.component";

import {KeycloakService} from "./authentication/keycloak.service";
import {WindupHttpService} from "./authentication/windup.http.service";
import {EditApplicationFormComponent} from "./group/edit-application-form.component";
import {UploadQueueComponent} from "./components/upload/upload-queue.component";
import {UploadProgressbarComponent} from "./components/upload/upload-progressbar.component";
import {AnalysisContextAdvancedOptionsModalComponent} from "./group/analysis-context-advanced-options-modal.component";
import {ConfigurationOptionsService} from "./group/configuration-options.service";
import {ModalDialogComponent} from "./shared/modal-dialog.component";
import {NotificationService} from "./notification/notification.service";
import {NotificationComponent} from "./notification/notification.component";
import {ConfirmDeactivateGuard} from "./shared/confirm-deactivate.guard";
import {PopoverComponent} from "./shared/popover.component";
import {JsTreeAngularWrapperComponent} from "./shared/js-tree-angular-wrapper.component";
import {PackageRegistryService} from "./services/package-registry.service";
import {TechnologiesReportComponent} from "./components/reports/technologies/technologies.report";
import {LoginComponent} from "./authentication/login.component";
import {LoggedInGuard} from "./authentication/logged-in.guard";
import {MigrationIssuesComponent} from "./components/reports/migration-issues/migration-issues.component";
import {MigrationIssuesTableComponent} from "./components/reports/migration-issues/migration-issues-table.component";
import {MigrationIssuesService} from "./components/reports/migration-issues/migration-issues.service";
import {TechReportService} from "./components/reports/technologies/tech-report.service";
import {FramesRestClientService} from './services/graph/frames-rest-client.service';
import {ContextMenuComponent} from "./components/navigation/context-menu.component";
import {GroupLayoutComponent} from "./components/layout/group-layout.component";
import {DefaultLayoutComponent} from "./components/layout/default-layout.component";
import {ApplicationGroupResolve} from "./group/application-group.resolve";
import {RouteLinkProviderService} from "./shared/route-link-provider-service";
import {ProjectResolve} from "./project/project.resolve";


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing
    ],
    declarations: [
        // pages
        AppComponent,
        AnalysisContextFormComponent,
        ApplicationGroupForm,
        ConfigurationComponent,
        GroupListComponent,
        MigrationProjectFormComponent,
        ProjectListComponent,
        RegisterApplicationFormComponent,
        EditApplicationFormComponent,

        // Reports
        TechnologiesReportComponent,

        // Components
        AddRulesPathModalComponent,
        AnalysisContextAdvancedOptionsModalComponent,
        BreadCrumbsComponent,
        ConfirmationModalComponent,
        ModalDialogComponent,
        NavbarComponent,
        ProgressBarComponent,
        RulesModalComponent,
        TechnologyComponent,

        FileSelectDirective,
        FileDropDirective,
        UploadQueueComponent,
        UploadProgressbarComponent,
        CustomRuleSelectionComponent,
        NotificationComponent,
        PopoverComponent,
        JsTreeAngularWrapperComponent,
        LoginComponent,
        JsTreeAngularWrapperComponent,
        MigrationIssuesComponent,
        MigrationIssuesTableComponent,
        LoginComponent,
        ContextMenuComponent,
        GroupLayoutComponent,
        DefaultLayoutComponent
    ],
    providers: [
        appRoutingProviders,
        KeycloakService,
        AnalysisContextService,
        ApplicationGroupService,
        ConfigurationService,
        ConfigurationOptionsService,
        ConfirmDeactivateGuard,
        FileService,
        MigrationPathService,
        MigrationProjectService,
        RegisteredApplicationService,
        RuleService,
        WindupService,
        NotificationService,
        PackageRegistryService,
        LoggedInGuard,
        MigrationIssuesService,
        TechReportService,
        FramesRestClientService,
        ApplicationGroupResolve,
        ProjectResolve,
        {
            provide: RouteLinkProviderService,
            useFactory: () => {
                return new RouteLinkProviderService(appRoutes);
            }
        },
        {
            provide: Http,
            useFactory:
                (
                    backend: XHRBackend,
                    defaultOptions: RequestOptions,
                    keycloakService: KeycloakService
                ) => new WindupHttpService(backend, defaultOptions, keycloakService),
            deps: [XHRBackend, RequestOptions, KeycloakService]
        },
        {
            provide: FileUploader,
            useValue: new FileUploader({})
        }
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
