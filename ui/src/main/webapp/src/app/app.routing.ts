import {Routes, RouterModule} from '@angular/router';
import {ProjectListComponent} from "./project/project-list.component";
import {RegisterApplicationFormComponent} from "./registered-application/register-application-form.component";
import {MigrationProjectFormComponent} from "./project/migration-project-form.component";
import {AnalysisContextFormComponent} from "./analysis-context/analysis-context-form.component";
import {ConfigurationComponent} from "./configuration/configuration.component";
import {EditApplicationFormComponent} from "./registered-application/edit-application-form.component";
import {ConfirmDeactivateGuard} from "./shared/confirm-deactivate.guard";
import {TechnologiesReportComponent} from "./reports/technologies/technologies-report.component";
import {DependenciesReportComponent} from "./reports/dependencies/dependencies-report.component";
import {LoginComponent} from "./components/login.component";
import {LoggedInGuard} from "./core/authentication/logged-in.guard";
import {ProjectLayoutComponent} from "./project/project-layout.component";
import {DefaultLayoutComponent} from "./shared/layout/default-layout.component";
import {MigrationIssuesComponent} from "./reports/migration-issues/migration-issues.component";
import {ProjectResolve} from "./project/project.resolve";
import {SourceResolve} from "../app/reports/source/source.resolve";
import {ConfigurationResolve} from "./configuration/configuration.resolve";
import {ApplicationResolve} from "./registered-application/application.resolve";
import {FullFlattenedRoute} from "./core/routing/route-flattener.service";
import {AllExecutionsComponent} from "./executions/all-executions.component";
import {SourceReportComponent} from "./reports/source/source-report.component";
import {ApplicationDetailsComponent} from "./reports/application-details/application-details.component";
import {ApplicationIndexComponent} from "./reports/application-index/application-index.component";
import {ReportFilterComponent} from "./reports/filter/report-filter.component";
import {RuleProviderExecutionsComponent} from "./reports/rule-provider-executions/rule-provider-executions.component";
import {WizardComponent} from "./shared/wizard/wizard.component";
import {ExecutionDetailComponent} from "./executions/execution-detail.component";
import {ApplicationListComponent} from "./registered-application/application-list.component";
import {ProjectExecutionsComponent} from "./executions/project-executions.component";
import {WizardLayoutComponent} from "./shared/layout/wizard-layout.component";
import {ExecutionsLayoutComponent} from "./executions/executions-layout.component";
import {ApplicationLevelLayoutComponent} from "./reports/application-level-layout.component";

export const executionLevelRoutes: Routes = [
    {path: '', component: ExecutionDetailComponent, data: {displayName: 'Execution Info'}},
    {path: 'dependencies-report', component: DependenciesReportComponent, data: {displayName: 'Dependency Report'}},
    {path: 'technology-report', component: TechnologiesReportComponent, data: {displayName: 'Technology Report'}},
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
    {path: 'executed-rules', component: RuleProviderExecutionsComponent, data: {displayName: 'Executed Rules'}},
    {path: 'dependencies', component: DependenciesReportComponent, data: {displayName: 'Dependencies Report' }}
];


export const appRoutes: Routes = [
    {path: "login", component: LoginComponent},

    // Authenticated routes
    {
        path: '',
        canActivate: [LoggedInGuard],

        canActivateChild: [LoggedInGuard],
        children: [
            {
                path: '',
                component: DefaultLayoutComponent,
                children: [
                    {path: '', redirectTo: "/project-list", pathMatch: "full"},
                    {
                        path: "configuration",
                        resolve: { configuration: ConfigurationResolve },
                        component: ConfigurationComponent,
                        data: {
                            displayName: "Global Configuration"
                        }
                    },
                    {path: "project-list",           component: ProjectListComponent,   data: {displayName: "Projects"}},
                    {path: 'executions', component: AllExecutionsComponent, data: {displayName: 'Global Executions List'}}
                ]
            },
            {
                path: 'wizard',
                component: WizardLayoutComponent,
                children: [
                    {
                        path: '',
                        component: WizardComponent,
                        data: {
                            steps: [
                                { name: 'Create New Project', path: 'create-project' },
                                { name: 'Add Applications', path: 'add-applications' },
                                { name: 'Configure Analysis', path: 'configure-analysis' }
                            ],
                            wizard: true
                        },
                        children: [
                            { path: 'create-project', component: MigrationProjectFormComponent, data: {displayName: 'Create Project', wizard: true} },
                            {
                                path: 'project/:projectId',
                                resolve: { project: ProjectResolve },
                                children: [
                                    { path: 'add-applications', component: RegisterApplicationFormComponent },
                                    { path: 'configure-analysis', component: AnalysisContextFormComponent }
                                ]
                            },
                        ]
                    }
                ]
            },
            {
                path: 'projects',
                children: [
                    {path: '', component: DefaultLayoutComponent, children: [
                        {path: '', component: ProjectListComponent, data: {displayName: "Projects"}},
                        {path: 'create', component: MigrationProjectFormComponent, data: {displayName: 'Create Project'}},
                    ]},
                    {
                        path: ':projectId',
                        data: {
                            breadcrumbTitle: getProjectBreadcrumbTitle
                        },
                        resolve: { project: ProjectResolve },
                        children: [
                            {
                                path: '',
                                component: ProjectLayoutComponent,
                                children: [
                                    { path: '', redirectTo: 'project-detail', pathMatch: 'full' },
                                    { path: 'project-detail', component: ProjectExecutionsComponent, data: {displayName: 'Executions'}},
                                    { path: 'applications', children: [
                                        { path: '', component: ApplicationListComponent, data: {displayName: 'Application List'} },
                                        { path: 'register', component: RegisterApplicationFormComponent, data: {displayName: "Application Registration"}},
                                        {
                                            path: ':applicationId/edit',
                                            component: EditApplicationFormComponent,
                                            resolve: { application: ApplicationResolve },
                                            data: {displayName: "Edit Application"}
                                        },
                                    ]},
                                    { path: 'analysis-context', component: AnalysisContextFormComponent, data: {displayName: "Configure Analysis"}, canDeactivate: [ConfirmDeactivateGuard]},                                ]
                            },
                            { path: '', component: DefaultLayoutComponent, children: [
                                {path: 'edit', component: MigrationProjectFormComponent, data: {displayName: 'Edit Project'}},
                            ]},
                            {
                                path: 'reports/:executionId',
                                data: {
                                    breadcrumbTitle: getExecutionBreadcrumbTitle
                                },
                                component: ExecutionsLayoutComponent,
                                children: executionLevelRoutes
                            },
                            {
                                path: 'reports/:executionId/applications/:applicationId',
                                data: {
                                    breadcrumbTitle: getExecutionBreadcrumbTitle
                                },
                                component: ApplicationLevelLayoutComponent,
                                children: executionLevelRoutes
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

export function getExecutionBreadcrumbTitle(route: FullFlattenedRoute) {
    return `Execution ${route.params['executionId']}`;
}

export function getProjectBreadcrumbTitle(route: FullFlattenedRoute) {
    return `Project ${route.data['project'].title}`;
}

export function getSourceReportBreadcrumbTitle(route: FullFlattenedRoute) {
    return `Source of ${route.data['sourceFile'] && route.data['sourceFile'].fileName ? route.data['sourceFile'].fileName : "file"}`;
}

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(appRoutes);
