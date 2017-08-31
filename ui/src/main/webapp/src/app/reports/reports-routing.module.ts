import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";

import {ExecutionResolve} from "../executions/execution.resolve";
import {ExecutionsLayoutComponent} from "../executions/executions-layout.component";
import {ApplicationLevelLayoutComponent} from "./application-level-layout.component";
import {ExecutionApplicationListComponent} from "./execution-application-list/execution-application-list.component";
import {DependenciesReportComponent} from "./dependencies/dependencies-report.component";
import {TechnologiesReportComponent} from "./technologies/technologies-report.component";
import {MigrationIssuesComponent} from "./migration-issues/migration-issues.component";
import {SourceResolve} from "./source/source.resolve";
import {SourceReportComponent} from "./source/source-report.component";
import {ApplicationIndexComponent} from "./application-index/application-index.component";
import {ApplicationDetailsComponent} from "./application-details/application-details.component";
import {RuleProviderExecutionsComponent} from "../executions/rule-provider-executions/rule-provider-executions.component";
import {FullFlattenedRoute} from "../core/routing/route-flattener.service";
import {ExecutionDetailComponent} from "../executions/execution-detail.component";
import {IgnoredFilesReportComponent} from "./ignoredFiles/ignoredFiles-report.component";
import {TechnologiesEJBReportComponent} from "./technologies/technologies-report-ejb.component";
import {HardcodedIPReportComponent} from "./hardcoded-ip/hardcoded-ip.component";

export const executionLevelRoutes: Routes = [
    {path: '', component: ExecutionApplicationListComponent, data: {displayName: 'Applications'}},
    {path: 'dependencies-report', component: DependenciesReportComponent, data: {displayName: 'Dependency Report'}},
    {path: 'ignoredFiles-report', component: IgnoredFilesReportComponent, data: {displayName: 'Ignored Files Report'}},
    {path: 'technology-report', component: TechnologiesReportComponent, data: {displayName: 'Technology Report'},
        children: [
            {path: 'ejb', component: TechnologiesEJBReportComponent, data: {displayName: 'EJB Report'}},
        ]
    },
    {path: 'technology-report-ejb', component: TechnologiesEJBReportComponent, data: {displayName: 'EJB Report'}},
    {path: 'technology-report-hardcoded-ip', component: HardcodedIPReportComponent, data: {displayName: 'Hardcoded IP Addresses'}},
    {path: 'migration-issues',
        children: [
            {path: '', component: MigrationIssuesComponent, data: {displayName: 'Issues'}},
            {path: 'source/:fileId', component: SourceReportComponent, resolve: { sourceFile: SourceResolve }, data: {displayName: 'Source Report', breadcrumbTitle: getSourceReportBreadcrumbTitle}}
        ]
    },
    {path: 'source/:fileId', component: SourceReportComponent, resolve: { sourceFile: SourceResolve }, data: {displayName: 'Source Report', breadcrumbTitle: getSourceReportBreadcrumbTitle}},
    {path: 'application-index', component: ApplicationIndexComponent, data: { displayName: 'Dashboard'}},
    {path: 'application-details',
        children: [
            {path: '', component: ApplicationDetailsComponent, data: { displayName: 'Application Details'}},
            {path: 'source/:fileId', component: SourceReportComponent, resolve: { sourceFile: SourceResolve }, data: {
                displayName: 'Source Report', breadcrumbTitle: getSourceReportBreadcrumbTitle
            }}
        ]
    },
    {path: 'hardcoded-ip',
        children: [
            {path: '', component: HardcodedIPReportComponent, data: {displayName: 'Hardcoded IP Addresses'}},
            {path: 'source/:fileId', component: SourceReportComponent, resolve: { sourceFile: SourceResolve }, data: {displayName: 'Source Report', breadcrumbTitle: getSourceReportBreadcrumbTitle}}
        ]
    },
    {path: 'executed-rules', component: RuleProviderExecutionsComponent, data: {displayName: 'Executed Rules'}},
    {path: 'dependencies', component: DependenciesReportComponent, data: {displayName: 'Dependencies Report' }},
    {path: 'execution-details', component: ExecutionDetailComponent, data: {displayName: 'Execution Info'}},
];

const routes: Routes = [
    {
        path: ':executionId',
        data: {
            breadcrumbTitle: getExecutionBreadcrumbTitle,
            level: 'global'
        },
        resolve: {
            execution: ExecutionResolve
        },
        component: ExecutionsLayoutComponent,
        children: executionLevelRoutes
    },
    {
        path: ':executionId/applications/:applicationId',
        data: {
            breadcrumbTitle: getExecutionBreadcrumbTitle,
            level: 'application'
        },
        resolve: {
            execution: ExecutionResolve
        },
        component: ApplicationLevelLayoutComponent,
        children: executionLevelRoutes
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportsRoutingModule {}

export function getSourceReportBreadcrumbTitle(route: FullFlattenedRoute) {
    return `Source of ${route.data['sourceFile'] && route.data['sourceFile'].fileName ? route.data['sourceFile'].fileName : "file"}`;
}

export function getExecutionBreadcrumbTitle(route: FullFlattenedRoute) {
    return `Execution ${route.params['executionId']}`;
}
