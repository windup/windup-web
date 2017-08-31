import {NgModule} from "@angular/core";
import {TagDataService} from "./tag-data.service";
import {PrettyPathPipe} from "./pretty-path.pipe";
import {TechnologyTagComponent} from "./technology-tag/technology-tag.component";
import {TechReportService} from "./technologies/tech-report.service";
import {TechnologiesReportComponent} from "./technologies/technologies-report.component";
import {JpaReportComponent} from "./jpa/jpa-report.component";
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
import {TechnologiesEJBReportComponent} from "./technologies/technologies-report-ejb.component";
import {HardcodedIPReportComponent} from "./hardcoded-ip/hardcoded-ip.component";
import {HardcodedIPService} from "./hardcoded-ip/hardcoded-ip.service";
import {JpaReportService} from "./jpa/jpa-report.service";

@NgModule({
    imports: [
        SharedModule,
        ReportsRoutingModule,
        NgxChartsModule,
        ExecutionsModule,
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
        JpaReportComponent,
        TechnologyTagComponent,
        ApplicationLevelLayoutComponent,
        ExecutionApplicationListComponent,
        PackageChartComponent,

        EffortLevelPipe,
        PrettyPathPipe,
        TechnologiesEJBReportComponent,
        HardcodedIPReportComponent,
    ],
    exports: [
        ApplicationDetailsComponent,
        ApplicationIndexComponent,
        DependenciesReportComponent,
        ReportFilterComponent,
        MigrationIssuesComponent,
        SourceReportComponent,
        TechnologiesReportComponent,
        JpaReportComponent,
        ApplicationLevelLayoutComponent,

        TechnologyTagComponent,
        ExecutionApplicationListComponent,
        TechnologiesEJBReportComponent,

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
        JpaReportService,
        PrettyPathPipe,
        TagDataService,
        // TagFilterService
        SourceResolve,
        EffortLevelPipe,
        HardcodedIPService,
    ]
})
export class ReportsModule {
}
