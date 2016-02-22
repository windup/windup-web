import {Component} from 'angular2/core';
import {NavbarComponent} from './navbar.component';
import {BreadCrumbsComponent} from './breadcrumbs.component';
import {ApplicationListComponent} from './applicationlist.component';

@Component({
    selector: 'windup-app',
    templateUrl: 'app/templates/app.component.html',
    directives: [NavbarComponent, BreadCrumbsComponent, ApplicationListComponent]
})
export class AppComponent {
}