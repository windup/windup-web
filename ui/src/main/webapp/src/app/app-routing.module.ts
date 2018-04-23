import {RouterModule, Routes} from "@angular/router";
import {ProjectListComponent} from "./project/project-list.component";
import {RegisterApplicationFormComponent} from "./registered-application/register-application-form.component";
import {MigrationProjectFormComponent} from "./project/migration-project-form.component";
import {AnalysisContextFormComponent} from "./analysis-context/analysis-context-form.component";
import {ConfigurationComponent} from "./configuration/configuration.component";
import {EditApplicationFormComponent} from "./registered-application/edit-application-form.component";
import {ConfirmDeactivateGuard} from "./shared/confirm-deactivate.guard";
import {LoggedInGuard} from "./core/authentication/logged-in.guard";
import {ProjectLayoutComponent} from "./project/project-layout.component";
import {DefaultLayoutComponent} from "./shared/layout/default-layout.component";
import {ProjectResolve} from "./project/project.resolve";
import {ConfigurationResolve} from "./configuration/configuration.resolve";
import {ApplicationResolve} from "./registered-application/application.resolve";
import {FullFlattenedRoute} from "./core/routing/route-flattener.service";
import {AllExecutionsComponent} from "./executions/all-executions.component";
import {WizardComponent} from "./shared/wizard/wizard.component";
import {ExecutionDetailComponent} from "./executions/execution-detail.component";
import {ApplicationListComponent} from "./registered-application/application-list.component";
import {ProjectExecutionsComponent} from "./executions/project-executions.component";
import {WizardLayoutComponent} from "./shared/layout/wizard-layout.component";
import {AboutPageComponent} from "./misc/about.component";
import {LogoutGuard} from "./core/authentication/logout.guard";
import {NgModule} from "@angular/core";

export const appRoutes: Routes = [
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
                    {path: 'about', component: AboutPageComponent},
                    {
                        path: "configuration",
                        component: ConfigurationComponent,
                        resolve: { configuration: ConfigurationResolve },
                        data: { displayName: "Global Configuration" }
                    },
                    {path: "project-list", component: ProjectListComponent,   data: {displayName: "Projects"}},
                    {path: 'executions',   component: AllExecutionsComponent, data: {displayName: 'Global Executions List'}}
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
                            wizardRootUrl: 'wizard/project/:projectId',
                            steps: [
                                { name: 'Create Project', path: 'create-project' },
                                { name: 'Add Applications', path: 'add-applications' },
                                { name: 'Configure the Analysis', path: 'configure-analysis' }
                            ],
                            wizard: true
                        },
                        children: [
                            { path: 'create-project', component: MigrationProjectFormComponent, data: { displayName: 'Create Project', wizard: true, currentStep: 0 } },
                            {
                                path: 'project/:projectId',
                                resolve: { project: ProjectResolve },
                                children: [
                                    { path: 'create-project', component: MigrationProjectFormComponent, data: { currentStep: 0 }},
                                    { path: 'add-applications', component: RegisterApplicationFormComponent, data: { currentStep: 1 }},
                                    { path: 'configure-analysis', component: AnalysisContextFormComponent, data: { currentStep: 2 }}
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
                                    { path: ':executionId/execution-details', component: ExecutionDetailComponent, data: {displayName: 'Execution Info'}},
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
                                    { path: 'analysis-context', component: AnalysisContextFormComponent, data: {displayName: "Configure Analysis"}, canDeactivate: [ConfirmDeactivateGuard]},
                                ]
                            },
                            { path: '', component: DefaultLayoutComponent, children: [
                                {path: 'edit', component: MigrationProjectFormComponent, data: {displayName: 'Edit Project'}},
                            ]},
                            {
                                path: 'reports',
                                loadChildren: './reports/reports.module#ReportsModule'
                            }
                        ]
                    }
                ]
            },
        ]
    },
    {
        path: 'logout',
        canActivate: [LogoutGuard],
        component: DefaultLayoutComponent
    },
    {
        path: '**',  // The wildcard route pushes the user to the main page if there is no match
        redirectTo: '/project-list'
    }
];

export function getProjectBreadcrumbTitle(route: FullFlattenedRoute) {
    return `Project ${route.data['project'].title}`;
}

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: false } // <-- Set to true to debug routing
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}
