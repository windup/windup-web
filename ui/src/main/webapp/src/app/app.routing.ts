import {Routes, RouterModule} from '@angular/router';
import {ProjectListComponent} from "./components/project-list/project-list.component";
import {GroupPageComponent} from "./components/group.page.component";
import {RegisterApplicationFormComponent} from "./components/register-application-form.component";
import {MigrationProjectFormComponent} from "./components/migration-project-form.component";
import {ApplicationGroupForm} from "./components/application-group-form.component";
import {AnalysisContextFormComponent} from "./components/analysis-context-form.component";
import {ConfigurationComponent} from "./components/configuration.component";
import {EditApplicationFormComponent} from "./components/edit-application-form.component";
import {ConfirmDeactivateGuard} from "./confirm-deactivate.guard";
import {TechnologiesReportComponent} from "./components/reports/technologies/technologies-report.component";
import {DependenciesReportComponent} from "./components/reports/dependencies/dependencies-report.component";
import {LoginComponent} from "./components/login.component";
import {LoggedInGuard} from "./services/logged-in.guard";
import {ProjectLayoutComponent} from "./components/layout/project-layout.component";
import {DefaultLayoutComponent} from "./components/layout/default-layout.component";
import {ApplicationGroupResolve} from "./components/group/application-group.resolve";
import {MigrationIssuesComponent} from "./components/reports/migration-issues/migration-issues.component";
import {ProjectResolve} from "./services/project.resolve";
import {ConfigurationResolve} from "./services/configuration.resolve";
import {ApplicationResolve} from "./services/application.resolve";
import {FullFlattenedRoute} from "./services/route-flattener.service";
import {GroupExecutionsComponent} from "./components/executions/group-executions.component";
import {AllExecutionsComponent} from "./components/executions/all-executions.component";
import {SourceReportComponent} from "./components/reports/source/source-report.component";
import {ApplicationDetailsComponent} from "./components/reports/application-details/application-details.component";
import {ApplicationIndexComponent} from "./components/reports/application-index/application-index.component";
import {ReportFilterComponent} from "./components/reports/filter/report-filter.component";
import {RuleProviderExecutionsComponent} from "./components/reports/rule-provider-executions/rule-provider-executions.component";
import {WizardComponent} from "./components/wizard.component";
import {ExecutionDetailComponent} from "./components/executions/execution-detail.component";
import {ApplicationListComponent} from "./components/application-list.component";
import {ProjectExecutionsComponent} from "./components/executions/project-executions.component";

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
                component: DefaultLayoutComponent,
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
                                path: 'group/:groupId',
                                resolve: { applicationGroup: ApplicationGroupResolve },
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
                                component: ProjectLayoutComponent, data: {displayName: 'Project Detail'},
                                children: [
                                    { path: '', component: ProjectExecutionsComponent, data: {displayName: 'Application List'} },
                                    { path: 'applications', children: [
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
                                    {
                                        path: 'groups/:groupId',
                                        resolve: {
                                            applicationGroup: ApplicationGroupResolve
                                        },
                                        data: {
                                          breadcrumbs: {
                                              ignore: true
                                          }
                                        },
                                        children: [
                                            { path: '', component: GroupPageComponent },
                                            { path: 'analysis-context', component: AnalysisContextFormComponent, data: {displayName: "Edit Analysis Context"}, canDeactivate: [ConfirmDeactivateGuard]},
                                            { path: 'reports', children: [
                                                { path: 'filter', component: ReportFilterComponent, data: {displayName: 'Report Filter'} },
                                            ]},
                                            { path: 'reports/:executionId', children: [
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
                                                {path: 'application-details', component: ApplicationDetailsComponent, data: { displayName: 'Application Details'}},
                                                {path: 'executed-rules', component: RuleProviderExecutionsComponent, data: {displayName: 'Executed Rules'}},
                                                {path: 'dependencies', component: DependenciesReportComponent, data: {displayName: 'Dependencies Report' }}
                                            ]},
                                            { path: '', children: [
                                                { path: 'edit', component: ApplicationGroupForm, data: {displayName: "Edit Application Group"} }
                                            ]},
                                            { path: 'executions', component: GroupExecutionsComponent, data: {displayName: 'Executions list'} }
                                        ]
                                    },
                                ]
                            },
                            { path: '', component: DefaultLayoutComponent, children: [
                                {path: 'edit', component: MigrationProjectFormComponent, data: {displayName: 'Edit Project'}},
                                {path: 'groups/create', component: ApplicationGroupForm, data: {displayName: 'Create Application Group'}},
                            ]},
                        ]
                    }
                ]
            }
        ]
    }
];

export function getGroupBreadcrumbTitle(route: FullFlattenedRoute) {
    return `Group ${route.data['applicationGroup'].title}`;
}

export function getProjectBreadcrumbTitle(route: FullFlattenedRoute) {
    return `Project ${route.data['project'].title}`;
}

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(appRoutes);
