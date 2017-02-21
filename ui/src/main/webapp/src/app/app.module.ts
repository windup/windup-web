import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, RequestOptions, XHRBackend, Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import 'rxjs/Rx';

import { AppComponent }  from './components/app.component';
import {routing, appRoutingProviders, appRoutes} from './app.routing';

import {ProjectListComponent} from "./components/project-list/project-list.component";
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
import {DependenciesReportComponent} from "./components/reports/dependencies/dependencies-report.component";
import {DependenciesService} from "./components/reports/dependencies/dependencies.service";
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
import {ApplicationDetailsService} from "./components/reports/application-details/application-details.service";
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
import {NoProjectsWelcomeComponent} from "./components/project-list/no-projects-welcome.component";
import {SortComponent} from "./components/sort.component";
import {SearchComponent} from "./components/search.component";
import {MomentModule} from "angular2-moment";
import {FileUploadModule, FileUploader} from "ng2-file-upload";
import {WizardComponent} from "./components/wizard.component";
import {DurationPipe} from "./components/duration.pipe";

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

        FileUploadModule,

        // NGX Charts
        NgxChartsModule,
        ChosenModule,

        // Moment
        MomentModule
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
        NoProjectsWelcomeComponent,
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
        DependenciesGraphComponent,
        SortComponent,
        SearchComponent,
        WizardComponent,
        DurationPipe
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
        ApplicationDetailsService,
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
            useFactory: createRouteLinkProviderService
        },
        BreadCrumbsService,
        {
            provide: Http,
            useFactory: breadcrumbsServiceFactory,
            deps: [XHRBackend, RequestOptions, KeycloakService]
        },
        {
            provide: FileUploader,
            useFactory: createFileUploader
        }
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }

let fileUploader = null;
export function createFileUploader() {
    if (fileUploader != null)
        return fileUploader;

    fileUploader = new FileUploader({});
    return fileUploader;
}

export function createRouteLinkProviderService() {
        return new RouteLinkProviderService(appRoutes);
}

export function breadcrumbsServiceFactory(backend: XHRBackend,
                                          defaultOptions: RequestOptions,
                                          keycloakService: KeycloakService) {
    return new WindupHttpService(backend, defaultOptions, keycloakService);
}
