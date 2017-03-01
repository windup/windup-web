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

import {KeycloakService} from "./core/authentication/keycloak.service";
import {WindupHttpService} from "./core/authentication/windup.http.service";
import {EditApplicationFormComponent} from "./components/edit-application-form.component";
import {UploadQueueComponent} from "./components/upload/upload-queue.component";
import {UploadProgressbarComponent} from "./components/upload/upload-progressbar.component";
import {AnalysisContextAdvancedOptionsModalComponent} from "./components/analysis-context-advanced-options-modal.component";
import {ConfigurationOptionsService} from "./services/configuration-options.service";
import {ModalDialogComponent} from "./components/modal-dialog.component";
import {NotificationService} from "./core/notification/notification.service";
import {NotificationComponent} from "./components/notification.component";
import {ConfirmDeactivateGuard} from "./confirm-deactivate.guard";
import {PopoverComponent} from "./components/popover.component";
import {JsTreeAngularWrapperComponent} from "./components/js-tree-angular-wrapper.component";
import {PackageRegistryService} from "./services/package-registry.service";
import {TechnologiesReportComponent} from "./components/reports/technologies/technologies-report.component";
import {LoginComponent} from "./components/login.component";
import {LoggedInGuard} from "./core/authentication/logged-in.guard";
import {MigrationIssuesComponent} from "./components/reports/migration-issues/migration-issues.component";
import {MigrationIssuesTableComponent} from "./components/reports/migration-issues/migration-issues-table.component";
import {MigrationIssuesService} from "./components/reports/migration-issues/migration-issues.service";
import {TechReportService} from "./components/reports/technologies/tech-report.service";
import {DependenciesReportComponent} from "./components/reports/dependencies/dependencies-report.component";
import {DependenciesService} from "./components/reports/dependencies/dependencies.service";
import {FramesRestClientService} from './services/graph/frames-rest-client.service';
import {ContextMenuComponent} from "./components/navigation/context-menu.component";
import {ProjectLayoutComponent} from "./components/layout/project-layout.component";
import {DefaultLayoutComponent} from "./components/layout/default-layout.component";
import {ApplicationGroupResolve} from "./components/group/application-group.resolve";
import {RouteLinkProviderService} from "./core/routing/route-link-provider-service";
import {ConfigurationResolve} from "./services/configuration.resolve";
import {ProjectResolve} from "./services/project.resolve";
import {ApplicationResolve} from "./services/application.resolve";
import {BreadCrumbsComponent as BreadCrumbsNavigationComponent} from "./components/navigation/breadcrumbs.component";
import {BreadCrumbsService} from "./components/navigation/breadcrumbs.service";
import {RouteFlattenerService} from "./core/routing/route-flattener.service";
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
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {ApplicationIndexComponent} from "./components/reports/application-index/application-index.component";
import {AggregatedStatisticsService} from "./components/reports/application-index/aggregated-statistics.service";
import {PackageChartComponent} from "./components/package-chart/package-chart.component";
import {ApplicationDetailsService} from "./components/reports/application-details/application-details.service";
import {TechnologyTagComponent} from "./components/reports/technology-tag/technology-tag.component";
import {PrettyPathPipe} from "./components/reports/pretty-path.pipe";
import {EventBusService} from "./core/events/event-bus.service";
import {WindupExecutionService} from "./services/windup-execution.service";
import {SchedulerService} from "./services/scheduler.service";
import {ActiveExecutionsProgressbarComponent} from "./components/executions/active-executions-progressbar.component";
import {TagDataService} from "./components/reports/tag-data.service";
import {RuleProviderExecutionsService} from "./components/reports/rule-provider-executions/rule-provider-executions.service";
import {RuleProviderExecutionsComponent} from "./components/reports/rule-provider-executions/rule-provider-executions.component";
import {initializeModelMappingData} from "./generated/tsModels/discriminator-mapping-data";
import {RouteHistoryService} from "./core/routing/route-history.service";
import {ChosenModule} from "./components/chosen/chosen.module";
import {DependenciesGraphComponent} from "./components/reports/dependencies/dependencies-graph.component";
import {NoProjectsWelcomeComponent} from "./components/project-list/no-projects-welcome.component";
import {SortComponent} from "./components/sort.component";
import {SearchComponent} from "./components/search.component";
import {MomentModule} from "angular2-moment";
import {FileUploadModule, FileUploader} from "ng2-file-upload";
import {WizardComponent} from "./components/wizard.component";
import {DurationPipe} from "./components/duration.pipe";
import {CheckboxesComponent} from "./components/reusable/checkboxes.component";
import {TabContainerComponent} from "./components/tabs/tab-container.component";
import {TabComponent} from "./components/tabs/tab.component";
import {LogViewComponent} from "./components/log-view.component";
import {ExecutionDetailComponent} from "./components/executions/execution-detail.component";
import {SortIndicatorComponent} from "./components/sort-indicator.component";
import {SortableTableComponent} from "./components/sortable-table.component";
import {StatusIconComponent} from "./components/status-icon.component";
import {GraphJSONToModelService} from "./services/graph/graph-json-to-model.service";
import {ApplicationListComponent} from "./components/application-list.component";
import {GroupPageComponent} from "./components/group.page.component";
import {ProjectExecutionsComponent} from "./components/executions/project-executions.component";

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
        LoginComponent,
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
        ApplicationIndexComponent,
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

        CheckboxesComponent,
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
        ProjectLayoutComponent,
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
        DurationPipe,
        TabContainerComponent,
        TabComponent,
        LogViewComponent,
        ExecutionDetailComponent,
        SortIndicatorComponent,
        SortableTableComponent,
        StatusIconComponent,
        ApplicationListComponent,
        ProjectExecutionsComponent
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
        },
        {
            provide: GraphJSONToModelService,
            useFactory: createGraphJSONToModelService,
            deps: [Http]
        },
        AggregatedStatisticsService
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

export function createGraphJSONToModelService(http: Http) {
    return new GraphJSONToModelService(http, null);
}

export class WINDUP_WEB {
    public static config = {
        // Hide the unfinished features in production mode.
        // TODO: Use process.env.ENV !== 'production' when AOT is fixed.
        // process is not accessible here. Supposedly the references to env vars should be replaced by WebPack but they are not.
        //hideUnfinishedFeatures: (process.env.hideUnfinishedFeatures !== (void 0)) ? process.env.hideUnfinishedFeatures : true;
        hideUnfinishedFeatures: true
    };
}

WINDUP_WEB.config = { hideUnfinishedFeatures: true };
