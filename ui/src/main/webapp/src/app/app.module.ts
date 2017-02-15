import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {Http, HttpModule, RequestOptions, XHRBackend} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DatePipe} from "@angular/common";

import "rxjs/Rx";

import {AppComponent} from "./components/app.component";
import {appRoutes, appRoutingProviders, routing} from "./app.routing";

import {ProgressBarComponent} from "./shared/progress-bar.component";
import {NavbarComponent} from "./shared/navigation/navbar.component";
import {BreadCrumbsComponent} from "./shared/navigation/breadcrumbs.component";
import {ConfirmationModalComponent} from "./shared/dialog/confirmation-modal.component";
import {UploadQueueComponent} from "./shared/upload/upload-queue.component";
import {UploadProgressbarComponent} from "./shared/upload/upload-progressbar.component";
import {NotificationComponent} from "./shared/notification.component";
import {ConfirmDeactivateGuard} from "./shared/confirm-deactivate.guard";
import {PopoverComponent} from "./shared/popover.component";
import {JsTreeAngularWrapperComponent} from "./shared/js-tree-angular-wrapper.component";
import {ModalDialogComponent} from "./shared/dialog/modal-dialog.component";
import {BreadCrumbsService} from "./shared/navigation/breadcrumbs.service";
import {ContextMenuComponent} from "./shared/navigation/context-menu.component";
import {DefaultLayoutComponent} from "./shared/layout/default-layout.component";
import {SortComponent} from "./shared/sort/sort.component";
import {SearchComponent} from "./shared/search/search.component";
import {WizardComponent} from "./shared/wizard/wizard.component";
import {DurationPipe} from "./shared/duration.pipe";
import {ReplacePipe} from "./shared/replace.pipe";
import {TabContainerComponent} from "./shared/tabs/tab-container.component";
import {TabComponent} from "./shared/tabs/tab.component";
import {LogViewComponent} from "./shared/log-view/log-view.component";
import {SortIndicatorComponent} from "./shared/sort/sort-indicator.component";
import {SortableTableComponent} from "./shared/sort/sortable-table.component";
import {StatusIconComponent} from "./shared/status-icon.component";
import {CheckboxesComponent} from "./shared/checkboxes.component";
import {WizardLayoutComponent} from "./shared/layout/wizard-layout.component";
import {NavbarSelectionComponent} from "./shared/navigation/navbar-selection.component";
import {ContextMenuLinkComponent} from "./shared/navigation/context-menu-link.component";
import {CacheService, getCacheServiceInstance} from "./shared/cache.service";
import {ProjectNameNotExistsValidator} from "./shared/validators/project-name-not-exists.validator";
import {PrettyExecutionStatus} from "./shared/pretty-execution-state.pipe";
import {AlternativeUploadQueueComponent} from "./shared/upload/alternative-upload-queue.component";
import {ExpandCollapseComponent} from "./shared/expand-collapse.component";
import {DialogService} from "./shared/dialog/dialog.service";
import {IsRouteActiveDirective} from "./shared/is-route-active.directive";
import {HamburgerMenuComponent} from "./shared/navigation/hamburger-menu.component";
import {ShortenPipe} from "./shared/text/shorten.pipe";
import {CustomSelectComponent} from "./shared/custom-select/custom-select.component";
import {PackageChartComponent} from "./shared/package-chart/package-chart.component";
import {SchedulerService} from "./shared/scheduler.service";
import {ChosenModule} from "./shared/chosen/chosen.module";

import {LogoutGuard} from "./core/authentication/logout.guard";
import {KeycloakService} from "./core/authentication/keycloak.service";
import {WindupHttpService} from "./core/authentication/windup.http.service";
import {NotificationService} from "./core/notification/notification.service";
import {LoggedInGuard} from "./core/authentication/logged-in.guard";
import {RouteLinkProviderService} from "./core/routing/route-link-provider-service";
import {RouteFlattenerService} from "./core/routing/route-flattener.service";
import {RouteHistoryService} from "./core/routing/route-history.service";
import {EventBusService} from "./core/events/event-bus.service";

import {SourceReportComponent} from "./reports/source/source-report.component";
import {ReportFilterComponent} from "./reports/filter/report-filter.component";
import {ReportFilterService} from "./reports/filter/report-filter.service";
import {ReportFilterResolve} from "./reports/filter/report-filter.resolve";
import {ReportFilterIndicatorComponent} from "./reports/filter/report-filter-indicator.component";
import {ApplicationDetailsComponent} from "./reports/application-details/application-details.component";
import {ApplicationIndexComponent} from "./reports/application-index/application-index.component";
import {AggregatedStatisticsService} from "./reports/application-index/aggregated-statistics.service";
import {ApplicationDetailsService} from "./reports/application-details/application-details.service";
import {TechnologyTagComponent} from "./reports/technology-tag/technology-tag.component";
import {PrettyPathPipe} from "./reports/pretty-path.pipe";
import {EffortLevelPipe} from "./reports/effort-level.enum";
import {TagDataService} from "./reports/tag-data.service";
import {RuleProviderExecutionsService} from "./reports/rule-provider-executions/rule-provider-executions.service";
import {RuleProviderExecutionsComponent} from "./reports/rule-provider-executions/rule-provider-executions.component";
import {DependenciesGraphComponent} from "./reports/dependencies/dependencies-graph.component";
import {ExecutionApplicationListComponent} from "./reports/execution-application-list/execution-application-list.component";
import {ApplicationLevelLayoutComponent} from "./reports/application-level-layout.component";
import {SourceResolve} from "./reports/source/source.resolve";
import {TechnologiesReportComponent} from "./reports/technologies/technologies-report.component";
import {MigrationIssuesComponent} from "./reports/migration-issues/migration-issues.component";
import {MigrationIssuesTableComponent} from "./reports/migration-issues/migration-issues-table.component";
import {MigrationIssuesService} from "./reports/migration-issues/migration-issues.service";
import {TechReportService} from "./reports/technologies/tech-report.service";
import {DependenciesReportComponent} from "./reports/dependencies/dependencies-report.component";
import {DependenciesService} from "./reports/dependencies/dependencies.service";

import {NoProjectsWelcomeComponent} from "./project/no-projects-welcome.component";
import {MigrationProjectFormComponent} from "./project/migration-project-form.component";
import {ProjectListComponent} from "./project/project-list.component";
import {MigrationProjectService} from "./project/migration-project.service";
import {ProjectLayoutComponent} from "./project/project-layout.component";
import {ProjectResolve} from "./project/project.resolve";

import {ConfigurationService} from "./configuration/configuration.service";
import {RuleService} from "./configuration/rule.service";
import {ConfigurationComponent} from "./configuration/configuration.component";
import {TechnologyComponent} from "./configuration/technology.component";
import {RulesModalComponent} from "./configuration/rules-modal.component";
import {AddRulesPathModalComponent} from "./configuration/add-rules-path-modal.component";
import {ConfigurationOptionsService} from "./configuration/configuration-options.service";
import {ConfigurationResolve} from "./configuration/configuration.resolve";

import {ApplicationListComponent} from "./registered-application/application-list.component";
import {RegisterApplicationFormComponent} from "./registered-application/register-application-form.component";
import {RegisteredApplicationService} from "./registered-application/registered-application.service";
import {ApplicationResolve} from "./registered-application/application.resolve";
import {ApplicationQueueListComponent} from "./registered-application/application-queue-list.component";
import {EditApplicationFormComponent} from "./registered-application/edit-application-form.component";

import {MomentModule} from "angular2-moment";
import {FileUploader, FileUploadModule} from "ng2-file-upload";
import {NgxChartsModule} from "@swimlane/ngx-charts";

import {ProjectExecutionsComponent} from "./executions/project-executions.component";
import {ExecutionDetailComponent} from "./executions/execution-detail.component";
import {ExecutionsLayoutComponent} from "./executions/executions-layout.component";
import {ExecutionResolve} from "./executions/execution.resolve";
import {ExecutionsListComponent} from "./executions/executions-list.component";
import {AllExecutionsComponent} from "./executions/all-executions.component";
import {ActiveExecutionsProgressbarComponent} from "./executions/active-executions-progressbar.component";

import {InViewport} from "./components/in-viewport.directive";

import {AboutPageComponent} from "./misc/about.component";

import {SelectApplicationsComponent} from "./analysis-context/select-applications.component";
import {AnalysisContextFormComponent} from "./analysis-context/analysis-context-form.component";
import {AnalysisContextService} from "./analysis-context/analysis-context.service";
import {MigrationPathService} from "./analysis-context/migration-path.service";
import {CustomRuleSelectionComponent} from "./analysis-context/custom-rule-selection.component";
import {AnalysisContextAdvancedOptionsModalComponent} from "./analysis-context/analysis-context-advanced-options-modal.component";
import {PackageRegistryService} from "./analysis-context/package-registry.service";

import {FileService} from "./services/file.service";
import {WindupService} from "./services/windup.service";
import {FramesRestClientService} from "./services/graph/frames-rest-client.service";
import {GraphJSONToModelService} from "./services/graph/graph-json-to-model.service";
import {FileModelService} from "./services/graph/file-model.service";
import {ClassificationService} from "./services/graph/classification.service";
import {HintService} from "./services/graph/hint.service";
import {WindupExecutionService} from "./services/windup-execution.service";

import {initializeModelMappingData} from "./generated/tsModels/discriminator-mapping-data";

import {ProjectModule} from "./project/project.module";
import {ApplicationModule} from "./registered-application/registered-application.module";
import {ConfigurationModule} from "./configuration/configuration.module";
import {AnalysisContextModule} from "./analysis-context/analysis-context.module";
import {ReportsModule} from "./reports/reports.module";
import {SharedModule} from "./shared/shared.module";
import {CoreModule} from "./core/core.module";

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
        // Directives
        InViewport,
        ProjectNameNotExistsValidator,

        // pages
        AppComponent,
        AnalysisContextFormComponent,
        ConfigurationComponent,
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
        EffortLevelPipe,

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
        JsTreeAngularWrapperComponent,
        MigrationIssuesComponent,
        MigrationIssuesTableComponent,
        ContextMenuComponent,
        ProjectLayoutComponent,
        ExecutionsLayoutComponent,
        DefaultLayoutComponent,
        WizardLayoutComponent,
        BreadCrumbsComponent,
        ExecutionsListComponent,
        AllExecutionsComponent,
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
        ReplacePipe,
        TabContainerComponent,
        TabComponent,
        LogViewComponent,
        ExecutionDetailComponent,
        SortIndicatorComponent,
        SortableTableComponent,
        StatusIconComponent,
        ApplicationListComponent,
        ProjectExecutionsComponent,
        NavbarSelectionComponent,
        SelectApplicationsComponent,
        ContextMenuLinkComponent,
        ApplicationLevelLayoutComponent,
        ExecutionApplicationListComponent,
        PrettyExecutionStatus,
        AlternativeUploadQueueComponent,
        AboutPageComponent,
        ExpandCollapseComponent,
        ApplicationQueueListComponent,
        IsRouteActiveDirective,
        HamburgerMenuComponent,
        ShortenPipe
    ],
    providers: [
        appRoutingProviders,
        KeycloakService,
        AnalysisContextService,
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
        ConfigurationResolve,
        ProjectResolve,
        ApplicationResolve,
        SourceResolve,
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
        ExecutionResolve,
        DialogService,
        LogoutGuard,
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
        {
          provide: CacheService,
          useFactory: getCacheServiceInstance
        },
        AggregatedStatisticsService,
        DatePipe,
        EffortLevelPipe
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
