import {NgModule} from "@angular/core";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

import {TagDataService} from "./tag-data.service";
import {PrettyPathPipe} from "./pretty-path.pipe";
import {TechnologyTagComponent} from "./technology-tag/technology-tag.component";
import {TechReportService} from "./technologies/tech-report.service";
import {TechnologiesReportComponent} from "./technologies/technologies-report.component";
import {SourceReportComponent} from "./source/source-report.component";
import {MigrationIssuesComponent} from "./migration-issues/migration-issues.component";
import {MigrationIssuesTableComponent} from "./migration-issues/migration-issues-table.component";
import {MigrationIssuesService} from "./migration-issues/migration-issues.service";
import {ReportFilterComponent} from "./filter/report-filter.component";
import {ReportFilterService} from "./filter/report-filter.service";
import {ReportFilterResolve} from "./filter/report-filter.resolve";
import {ReportFilterIndicatorComponent} from "./filter/report-filter-indicator.component";
import {DependenciesService} from "./dependencies/dependencies.service";
import {DependenciesReportComponent} from "./dependencies/dependencies-report.component";
import {ApplicationDetailsComponent} from "./application-details/application-details.component";
import {SharedModule} from "../shared/shared.module";
import {ApplicationDetailsService} from "./application-details/application-details.service";
import {TypeReferenceStatisticsService} from "./application-details/type-reference-statistics.service";
import {ApplicationIndexComponent} from "./application-index/application-index.component";
import {AggregatedStatisticsService} from "./application-index/aggregated-statistics.service";
import {DependenciesGraphComponent} from "./dependencies/dependencies-graph.component";
import {ReportsRoutingModule} from "./reports-routing.module";
import {ApplicationLevelLayoutComponent} from "./application-level-layout.component";
import {EffortLevelPipe} from "./effort-level.enum";
import {ExecutionApplicationListComponent} from "./execution-application-list/execution-application-list.component";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {PackageChartComponent} from "./package-chart/package-chart.component";
import {ExecutionsModule} from "../executions/executions.module";
import {SourceResolve} from "./source/source.resolve";
import {ProblemSummaryFilesComponent} from "./migration-issues/problem-summary-files.component";

@NgModule({
    imports: [
        SharedModule,
        ReportsRoutingModule,
        NgxChartsModule,
        ExecutionsModule,
        NoopAnimationsModule, // WINDUP-1579, needed since Angular 4
    ],
    declarations: [
        ApplicationDetailsComponent,
        ApplicationIndexComponent,
        DependenciesReportComponent,
        DependenciesGraphComponent,
        ReportFilterComponent,
        ReportFilterIndicatorComponent,
        MigrationIssuesComponent,
        MigrationIssuesTableComponent,
        ProblemSummaryFilesComponent,
        SourceReportComponent,
        TechnologiesReportComponent,
        TechnologyTagComponent,
        ApplicationLevelLayoutComponent,
        ExecutionApplicationListComponent,
        PackageChartComponent,

        EffortLevelPipe,
        PrettyPathPipe,
    ],
    exports: [
        ApplicationDetailsComponent,
        ApplicationIndexComponent,
        DependenciesReportComponent,
        ReportFilterComponent,
        MigrationIssuesComponent,
        SourceReportComponent,
        TechnologiesReportComponent,
        ApplicationLevelLayoutComponent,

        TechnologyTagComponent,
        ExecutionApplicationListComponent,

    ],
    providers: [
        ApplicationDetailsService,
        TypeReferenceStatisticsService,
        AggregatedStatisticsService,
        DependenciesService,
        ReportFilterService,
        ReportFilterResolve,
        MigrationIssuesService,
        TechReportService,
        PrettyPathPipe,
        TagDataService,
        // TagFilterService
        SourceResolve
    ]
})
export class ReportsModule {
}
