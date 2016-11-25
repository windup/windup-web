import {Routes, RouterModule} from '@angular/router';
import {ProjectListComponent} from "./components/project-list.component";
import {GroupListComponent} from "./components/group-list.component";
import {GroupPageComponent} from "./components/group.page.component";
import {RegisterApplicationFormComponent} from "./components/register-application-form.component";
import {MigrationProjectFormComponent} from "./components/migration-project-form.component";
import {ApplicationGroupForm} from "./components/application-group-form.component";
import {AnalysisContextFormComponent} from "./components/analysis-context-form.component";
import {ConfigurationComponent} from "./components/configuration.component";
import {EditApplicationFormComponent} from "./components/edit-application-form.component";
import {ConfirmDeactivateGuard} from "./confirm-deactivate.guard";
import {TechnologiesReportComponent} from "./components/reports/technologies/technologies-report.component";
import {LoginComponent} from "./components/login.component";
import {LoggedInGuard} from "./services/logged-in.guard";
import {GroupLayoutComponent} from "./components/layout/group-layout.component";
import {DefaultLayoutComponent} from "./components/layout/default-layout.component";
import {ApplicationGroupResolve} from "./components/group/application-group.resolve";
import {MigrationIssuesComponent} from "./components/reports/migration-issues/migration-issues.component";
import {ProjectResolve} from "./services/project.resolve";
import {ConfigurationResolve} from "./services/configuration.resolve";
import {ApplicationResolve} from "./services/application.resolve";

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
                    {path: "application-group-form", component: ApplicationGroupForm,             data: {displayName: "Edit Application Group"}}
                ]
            },
            {
                path: 'projects',
                component: DefaultLayoutComponent,
                children: [
                    {path: '', component: ProjectListComponent, data: {displayName: "Project List"}},
                    {path: 'create', component: MigrationProjectFormComponent, data: {displayName: 'Create Project'}},
                    {
                        path: ':projectId',
                        data: {displayName: 'Group List'},
                        resolve: {
                            project: ProjectResolve
                        },
                        children: [
                            {path: '', component: GroupListComponent, data: {displayName: 'Group List'}},
                            {path: 'edit', component: MigrationProjectFormComponent, data: {displayName: 'Edit Project'}},
                            {path: 'groups/create', component: ApplicationGroupForm, data: {displayName: 'Create Application Group'}},
                        ]
                    }
                ]
            },
            {
                path: 'groups/:groupId',
                component: GroupLayoutComponent,
                resolve: {
                    applicationGroup: ApplicationGroupResolve
                },
                children: [
                    { path: '', component: GroupPageComponent },
                    { path: 'edit', component: ApplicationGroupForm, data: {displayName: 'Edit Application Group'}},
                    { path: 'analysis-context', component: AnalysisContextFormComponent, data: {displayName: "Edit Analysis Context"}, canDeactivate: [ConfirmDeactivateGuard]},
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
                    { path: 'reports/:executionId', children: [
                        {path: 'technology-report', component: TechnologiesReportComponent, data: {displayName: 'Technology Report'}},
                        {path: 'migration-issues', component: MigrationIssuesComponent}
                    ]}
                ]
            },
        ]
    }
];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(appRoutes);
