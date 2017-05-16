import {NgModule} from "@angular/core";
import {TagDataService} from "./tag-data.service";
import {PrettyPathPipe} from "./pretty-path.pipe";
import {TechnologyTagComponent} from "./technology-tag/technology-tag.component";
import {TechReportService} from "./technologies/tech-report.service";
import {TechnologiesReportComponent} from "./technologies/technologies-report.component";
import {SourceReportComponent} from "./source/source-report.component";
import {RuleProviderExecutionsService} from "./rule-provider-executions/rule-provider-executions.service";
import {RuleProviderExecutionsComponent} from "./rule-provider-executions/rule-provider-executions.component";
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

@NgModule({
    imports: [
        SharedModule,
        ReportsRoutingModule,
        NgxChartsModule
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
        RuleProviderExecutionsComponent,
        SourceReportComponent,
        TechnologiesReportComponent,
        TechnologyTagComponent,
        ApplicationLevelLayoutComponent,
        ExecutionApplicationListComponent,

        EffortLevelPipe,
        PrettyPathPipe,
    ],
    exports: [
        ApplicationDetailsComponent,
        ApplicationIndexComponent,
        DependenciesReportComponent,
        ReportFilterComponent,
        MigrationIssuesComponent,
        RuleProviderExecutionsComponent,
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
        RuleProviderExecutionsService,
        TechReportService,
        PrettyPathPipe,
        TagDataService,
        // TagFilterService
    ]
})
export class ReportsModule {
}
