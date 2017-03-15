import {Routes, RouterModule} from '@angular/router';
import {ProjectListComponent} from "./project/project-list.component";
import {RegisterApplicationFormComponent} from "./registered-application//register-application-form.component";
import {MigrationProjectFormComponent} from "./project/migration-project-form.component";
import {AnalysisContextFormComponent} from "./analysis-context/analysis-context-form.component";
import {ConfigurationComponent} from "./configuration/configuration.component";
import {EditApplicationFormComponent} from "./registered-application//edit-application-form.component";
import {ConfirmDeactivateGuard} from "./shared/confirm-deactivate.guard";
import {TechnologiesReportComponent} from "./reports/technologies/technologies-report.component";
import {DependenciesReportComponent} from "./reports/dependencies/dependencies-report.component";
import {LoginComponent} from "./components/login.component";
import {LoggedInGuard} from "./core/authentication/logged-in.guard";
import {ProjectLayoutComponent} from "./project/project-layout.component";
import {DefaultLayoutComponent} from "./shared/layout/default-layout.component";
import {MigrationIssuesComponent} from "./reports/migration-issues/migration-issues.component";
import {ProjectResolve} from "./project/project.resolve";
import {ConfigurationResolve} from "./configuration/configuration.resolve";
import {ApplicationResolve} from "./registered-application//application.resolve";
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
                        resolve: {
                            configuration: ConfigurationResolve
                        },
                        component: ConfigurationComponent,
                        data: {
                            displayName: "Windup Configuration"
                        }
                    },
                    {path: "project-list",           component: ProjectListComponent,   data: {displayName: "Project List"}},
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
                        {path: '', component: ProjectListComponent, data: {displayName: "Project List"}},
                        {path: 'create', component: MigrationProjectFormComponent, data: {displayName: 'Create Project'}},
                    ]},
                    {
                        path: ':projectId',
                        data: {
                            breadcrumbTitle: getProjectBreadcrumbTitle
                        },
                        resolve: {
                            project: ProjectResolve
                        },
                        children: [
                            {
                                path: '',
                                component: ProjectLayoutComponent,
                                children: [
                                    { path: '', redirectTo: 'project-detail', pathMatch: 'full' },
                                    { path: 'project-detail', component: ProjectExecutionsComponent, data: {displayName: 'Executions List'}},
                                    { path: 'applications', children: [
                                        { path: '', component: ApplicationListComponent, data: {displayName: 'Application List'} },
                                        { path: 'register', component: RegisterApplicationFormComponent, data: {displayName: "Application Registration"}},
                                        {
                                            path: ':applicationId/edit',
                                            component: EditApplicationFormComponent,
                                            resolve: {
                                                application: ApplicationResolve
                                            },
                                            data: {displayName: "Edit Application"}
                                        },
                                    ]},
                                    { path: 'analysis-context', component: AnalysisContextFormComponent, data: {displayName: "Edit Analysis Context"}, canDeactivate: [ConfirmDeactivateGuard]},                                ]
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
                                children: [
                                    {path: '', component: ExecutionDetailComponent, data: {displayName: 'Execution Info'}},
                                    {path: 'dependencies-report', component: DependenciesReportComponent, data: {displayName: 'Dependency Report'}},
                                    {path: 'technology-report', component: TechnologiesReportComponent, data: {displayName: 'Technology Report'}},
                                    {path: 'migration-issues',
                                        children: [
                                            {path: '', component: MigrationIssuesComponent, data: {displayName: 'Migration Issues'}},
                                            {path: 'source/:fileId', component: SourceReportComponent, data: {displayName: 'Source Report'}}
                                        ]
                                    },
                                    {path: 'source/:fileId', component: SourceReportComponent, data: {displayName: 'Source Report'}},
                                    {path: 'application-index', component: ApplicationIndexComponent, data: { displayName: 'Application Index'}},
                                    {path: 'application-details',
                                        children: [
                                            {path: '', component: ApplicationDetailsComponent, data: { displayName: 'Application Details'}},
                                            {path: 'source/:fileId', component: SourceReportComponent, data: {displayName: 'Source Report'}}
                                        ]
                                    },
                                    {path: 'executed-rules', component: RuleProviderExecutionsComponent, data: {displayName: 'Executed Rules'}},
                                    {path: 'dependencies', component: DependenciesReportComponent, data: {displayName: 'Dependencies Report' }}
                                ]
                            },
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

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(appRoutes);
