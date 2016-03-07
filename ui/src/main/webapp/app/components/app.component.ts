import {Component} from 'angular2/core';
import {NavbarComponent} from './navbar.component';
import {BreadCrumbsComponent} from './breadcrumbs.component';
import {ApplicationListComponent} from './applicationlist.component';
import {RouteConfig, RouterOutlet} from 'angular2/router';
import {RegisterApplicationFormComponent} from "./registerapplicationform.component";

@Component({
    selector: 'windup-app',
    templateUrl: 'app/templates/app.component.html',
    directives: [NavbarComponent, BreadCrumbsComponent, RouterOutlet]
})
@RouteConfig([
    {path:"/application-list", name: "ApplicationList", component: ApplicationListComponent, useAsDefault: true},
    {path:"/register-application", name: "RegisterApplicationForm", component: RegisterApplicationFormComponent}
])
export class AppComponent {
}