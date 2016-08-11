import {Component} from '@angular/core';
import {NavbarComponent} from './navbar.component';
import {BreadCrumbsComponent} from './breadcrumbs.component';
import {ApplicationListComponent} from './applicationlist.component';
import {RouteConfig, RouterOutlet} from '@angular/router-deprecated';
import {RegisterApplicationFormComponent} from "./registerapplicationform.component";
import {MigrationProjectFormComponent} from "./migrationprojectform.component";
import {ProjectListComponent} from "./projectlist.component";
import {GroupListComponent} from "./grouplist.component";
import {ApplicationGroupForm} from "./applicationgroupform.component";
import {AnalysisContextFormComponent} from "./analysiscontextform.component";

@Component({
    selector: 'windup-app',
    templateUrl: 'app/components/app.component.html',
    directives: [NavbarComponent, BreadCrumbsComponent, RouterOutlet]
})
@RouteConfig([
    {path:"/project-list", name: "ProjectList", component: ProjectListComponent, data: {displayName: "Project List"}},
    {path:"/group-list", name: "GroupList", component: GroupListComponent, data: {displayName: "Group List"}},
    {path:"/application-list", name: "ApplicationList", component: ApplicationListComponent, useAsDefault: true, data: {displayName: "Application List"}},
    {path:"/register-application", name: "RegisterApplicationForm", component: RegisterApplicationFormComponent, data: {displayName: "Application Registration"}},
    {path:"/migration-project-form", name: "MigrationProjectForm", component: MigrationProjectFormComponent, data: {displayName: "Edit Project"}},
    {path:"/application-group-form", name: "ApplicationGroupForm", component: ApplicationGroupForm, data: {displayName: "Edit Application Group"}},
    {path:"/analysis-context-form", name: "AnalysisContextForm", component: AnalysisContextFormComponent, data: {displayName: "Edit Analysis Context"}},
])
export class AppComponent {
}