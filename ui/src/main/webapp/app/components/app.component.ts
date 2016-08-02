import {Component} from '@angular/core';
import {NavbarComponent} from './navbar.component';
import {BreadCrumbsComponent} from './breadcrumbs.component';
import {ApplicationListComponent} from './applicationlist.component';
import {RouteConfig, RouterOutlet} from '@angular/router-deprecated';
import {RegisterApplicationFormComponent} from "./registerapplicationform.component";
import {MigrationProjectFormComponent} from "./migrationprojectform.component";
import {ProjectListComponent} from "./projectlist.component";

@Component({
    selector: 'windup-app',
    templateUrl: 'app/components/app.component.html',
    directives: [NavbarComponent, BreadCrumbsComponent, RouterOutlet]
})
@RouteConfig([
    {path:"/project-list", name: "ProjectList", component: ProjectListComponent, data: {displayName: "Project List"}},
    {path:"/application-list", name: "ApplicationList", component: ApplicationListComponent, useAsDefault: true, data: {displayName: "Application List"}},
    {path:"/register-application", name: "RegisterApplicationForm", component: RegisterApplicationFormComponent, data: {displayName: "Application Registration"}},
    {path:"/migration-project-form", name: "MigrationProjectForm", component: MigrationProjectFormComponent, data: {displayName: "Edit Project"}},
])
export class AppComponent {
}