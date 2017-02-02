import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, RequestOptions, XHRBackend, Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import 'rxjs/Rx';

import {FileSelectDirective, FileDropDirective, FileUploader} from 'ng2-file-upload/ng2-file-upload';
import { AppComponent }  from './components/app.component';
import {routing, appRoutingProviders, appRoutes} from './app.routing';

import {ProjectListComponent} from "./components/project-list.component";
import {AnalysisContextFormComponent} from "./components/analysis-context-form.component";
import {ApplicationGroupForm} from "./components/application-group-form.component";
import {GroupListComponent} from "./components/group-list.component";
import {MigrationProjectFormComponent} from "./components/migration-project-form.component";
import {GroupPageComponent} from "./components/group.page.component";
import {RegisterApplicationFormComponent} from "./components/register-application-form.component";
import {ProgressBarComponent} from "./components/progress-bar.component";
import {NavbarComponent} from "./components/navbar.component";
import {BreadCrumbsComponent} from "./components/navigation/breadcrumbs.component";
import {ConfigurationService} from "./services/configuration.service";
import {AnalysisContextService} from "./services/analysis-context.service";
import {ApplicationGroupService} from "./services/application-group.service";
import {FileService} from "./services/file.service";
import {MigrationPathService} from "./services/migration-path.service";
import {MigrationProjectService} from "./services/migration-project.service";
import {RegisteredApplicationService} from "./services/registered-application.service";
import {WindupService} from "./services/windup.service";
import {RuleService} from "./services/rule.service";
import {ConfigurationComponent} from "./components/configuration.component";
import {TechnologyComponent} from "./components/technology.component";
import {RulesModalComponent} from "./components/rules-modal.component";
import {AddRulesPathModalComponent} from "./components/add-rules-path-modal.component";
import {ConfirmationModalComponent} from "./components/confirmation-modal.component";
import {CustomRuleSelectionComponent} from "./components/custom-rule-selection.component";

import {KeycloakService} from "./services/keycloak.service";
import {WindupHttpService} from "./services/windup.http.service";
import {EditApplicationFormComponent} from "./components/edit-application-form.component";
import {UploadQueueComponent} from "./components/upload/upload-queue.component";
import {UploadProgressbarComponent} from "./components/upload/upload-progressbar.component";
import {AnalysisContextAdvancedOptionsModalComponent} from "./components/analysis-context-advanced-options-modal.component";
import {ConfigurationOptionsService} from "./services/configuration-options.service";
import {ModalDialogComponent} from "./components/modal-dialog.component";
import {NotificationService} from "./services/notification.service";
import {NotificationComponent} from "./components/notification.component";
import {ConfirmDeactivateGuard} from "./confirm-deactivate.guard";
import {PopoverComponent} from "./components/popover.component";
import {JsTreeAngularWrapperComponent} from "./components/js-tree-angular-wrapper.component";
import {PackageRegistryService} from "./services/package-registry.service";
import {TechnologiesReportComponent} from "./components/reports/technologies/technologies-report.component";
import {LoginComponent} from "./components/login.component";
import {LoggedInGuard} from "./services/logged-in.guard";
import {MigrationIssuesComponent} from "./components/reports/migration-issues/migration-issues.component";
import {MigrationIssuesTableComponent} from "./components/reports/migration-issues/migration-issues-table.component";
import {MigrationIssuesService} from "./components/reports/migration-issues/migration-issues.service";
import {TechReportService} from "./components/reports/technologies/tech-report.service";
import {FramesRestClientService} from './services/graph/frames-rest-client.service';
import {ContextMenuComponent} from "./components/navigation/context-menu.component";
import {GroupLayoutComponent} from "./components/layout/group-layout.component";
import {DefaultLayoutComponent} from "./components/layout/default-layout.component";
import {ApplicationGroupResolve} from "./components/group/application-group.resolve";
import {RouteLinkProviderService} from "./services/route-link-provider-service";
import {ConfigurationResolve} from "./services/configuration.resolve";
import {ProjectResolve} from "./services/project.resolve";
import {ApplicationResolve} from "./services/application.resolve";
import {BreadCrumbsComponent as BreadCrumbsNavigationComponent} from "./components/navigation/breadcrumbs.component";
import {BreadCrumbsService} from "./components/navigation/breadcrumbs.service";
import {RouteFlattenerService} from "./services/route-flattener.service";
import {ExecutionsListComponent} from "./components/executions/executions-list.component";
import {AllExecutionsComponent} from "./components/executions/all-executions.component";
import {GroupExecutionsComponent} from "./components/executions/group-executions.component";
import {SourceReportComponent} from "./components/reports/source/source-report.component";
import {FileModelService} from "./services/graph/file-model.service";
import {ClassificationService} from "./services/graph/classification.service";
import {HintService} from "./services/graph/hint.service";
import {ReportFilterComponent} from "./components/reports/filter/report-filter.component";
import {ReportFilterService} from "./components/reports/filter/report-filter.service";
import {ReportFilterResolve} from "./components/reports/filter/report-filter.resolve";
import {CustomSelectComponent} from "./components/custom-select/custom-select.component";
import {ReportFilterIndicatorComponent} from "./components/reports/filter/report-filter-indicator.component";
import {ApplicationDetailsComponent} from "./components/reports/application-details/application-details.component";
import {NgxChartsModule} from "ngx-charts";
import {PackageChartComponent} from "./components/package-chart/package-chart.component";
import {ProjectTraversalService} from "./services/graph/project-traversal.service";
import {TechnologyTagComponent} from "./components/reports/technology-tag/technology-tag.component";
import {PrettyPathPipe} from "./components/reports/pretty-path.pipe";
import {EventBusService} from "./services/events/event-bus.service";
import {WindupExecutionService} from "./services/windup-execution.service";
import {SchedulerService} from "./services/scheduler.service";
import {ActiveExecutionsProgressbarComponent} from "./components/executions/active-executions-progressbar.component";
import {TagDataService} from "./components/reports/tag-data.service";
import {RuleProviderExecutionsService} from "./components/reports/rule-provider-executions/rule-provider-executions.service";
import {RuleProviderExecutionsComponent} from "./components/reports/rule-provider-executions/rule-provider-executions.component";
import {initializeModelMappingData} from "./generated/tsModels/discriminator-mapping-data";
import {RouteHistoryService} from "./services/route-history.service";
import {ChosenModule} from "./components/chosen/chosen.module";
import {DependenciesGraphComponent} from "./components/reports/dependencies/dependencies-graph.component";

/**
 * Load all mapping data from the generated files.
 */
initializeModelMappingData();

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing,

        // NGX Charts
        NgxChartsModule,
        ChosenModule
    ],
    declarations: [
        // pages
        AppComponent,
        AnalysisContextFormComponent,
        ApplicationGroupForm,
        ConfigurationComponent,
        GroupListComponent,
        GroupPageComponent,
        MigrationProjectFormComponent,
        ProjectListComponent,
        RegisterApplicationFormComponent,
        EditApplicationFormComponent,

        // Reports
        TechnologiesReportComponent,
        DependenciesReportComponent,
        SourceReportComponent,
        ApplicationDetailsComponent,
        PrettyPathPipe,

        // Report components
        PackageChartComponent,

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
        DefaultLayoutComponent,
        BreadCrumbsNavigationComponent,
        DefaultLayoutComponent,
        ExecutionsListComponent,
        AllExecutionsComponent,
        GroupExecutionsComponent,
        BreadCrumbsNavigationComponent,
        ReportFilterComponent,
        CustomSelectComponent,
        ReportFilterIndicatorComponent,
        TechnologyTagComponent,
        ActiveExecutionsProgressbarComponent,
        RuleProviderExecutionsComponent,
        DependenciesGraphComponent
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
        FileModelService,
        ClassificationService,
        HintService,
        ProjectTraversalService,
        FramesRestClientService,
        ApplicationGroupResolve,
        ConfigurationResolve,
        ProjectResolve,
        ApplicationResolve,
        RouteFlattenerService,
        ReportFilterService,
        ReportFilterResolve,
        DependenciesService,
        EventBusService,
        WindupExecutionService,
        TagDataService,
        SchedulerService,
        RuleProviderExecutionsService,
        RouteHistoryService,
        {
            provide: RouteLinkProviderService,
            useFactory: () => {
                return new RouteLinkProviderService(appRoutes);
            }
        },
        BreadCrumbsService,
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
