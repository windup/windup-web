import { Routes, RouterModule } from '@angular/router';
import {ProjectListComponent} from "./components/projectlist.component";
import {GroupListComponent} from "./components/grouplist.component";
import {RegisterApplicationFormComponent} from "./components/registerapplicationform.component";
import {MigrationProjectFormComponent} from "./components/migrationprojectform.component";
import {ApplicationGroupForm} from "./components/applicationgroupform.component";
import {AnalysisContextFormComponent} from "./components/analysiscontextform.component";
import {ConfigurationComponent} from "./components/configuration.component";
import {EditApplicationFormComponent} from "./components/edit-application-form.component";
import {ConfirmDeactivateGuard} from "./confirm-deactivate.guard";
import {TechnologiesReportComponent} from "./components/reports/technologies/technologies.report";
import {LoginComponent} from "./authentication/login.component";
import {LoggedInGuard} from "./authentication/logged-in.guard";
import {GroupLayoutComponent} from "./components/layout/group-layout.component";
import {DefaultLayoutComponent} from "./components/layout/default-layout.component";
import {ApplicationGroupResolve} from "./components/group/application-group.resolve";
import {MigrationIssuesComponent} from "./components/reports/migration-issues/migration-issues.component";
import {ProjectResolve} from "./services/project.resolve";

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
                    {path: "configuration",          component: ConfigurationComponent, data: {displayName: "Windup Configuration"}},
                    {path: "project-list",           component: ProjectListComponent,   data: {displayName: "Project List"}},
                    {path: "group-list",             component: GroupListComponent,     data: {displayName: "Group List"}},
                    {path: "register-application",   component: RegisterApplicationFormComponent, data: {displayName: "Application Registration"}},
                    {path: "edit-application/:id",   component: EditApplicationFormComponent,     data: {displayName: "Update application"}},
                    {path: "migration-project-form", component: MigrationProjectFormComponent,    data: {displayName: "Edit Project"}},
                    {path: "application-group-form", component: ApplicationGroupForm,             data: {displayName: "Edit Application Group"}},
                    {path: "analysis-context-form",  component: AnalysisContextFormComponent,     data: {displayName: "Edit Analysis Context"}, canDeactivate: [ConfirmDeactivateGuard]},
                ]
            },
            {
                path: 'projects',
                children: [
                    {path: '', component: ProjectListComponent, data: {displayName: "Project List"}},
                    {
                        path: ':projectId',
                        resolve: {
                            project: ProjectResolve
                        },
                        data: {displayName: 'Group List'},
                        children: [
                            {path: '', component: GroupListComponent, data: {displayName: 'Group List'}},
                            {path: 'edit', component: MigrationProjectFormComponent, data: {displayName: 'Edit Project'}},
                            {path: 'groups/create', component: ApplicationGroupForm, data: {displayName: 'Create Application Group'}},
                        ]
                    },
                    {path: 'create', component: MigrationProjectFormComponent, data: {displayName: 'Create Project'}}
                ]
            },
            {
                path: 'groups/:groupId',
                component: GroupLayoutComponent,
                resolve: {
                    applicationGroup: ApplicationGroupResolve
                },
                children: [
                    { path: '' },
                    { path: 'edit', component: ApplicationGroupForm, data: {displayName: 'Edit Application Group'}},
                    { path: 'analysis-context', component: AnalysisContextFormComponent, data: {displayName: "Edit Analysis Context"}, canDeactivate: [ConfirmDeactivateGuard]},
                    { path: 'applications', children: [
                        { path: 'register', component: RegisterApplicationFormComponent, data: {displayName: "Application Registration"}},
                        { path: ':applicationId', children: [
                            { path: 'edit', component: RegisterApplicationFormComponent, data: {displayName: "Edit Application"}},
                        ]}
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
