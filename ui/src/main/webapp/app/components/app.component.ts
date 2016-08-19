import {Component} from '@angular/core';
import {NavbarComponent} from './navbar.component';
import {BreadCrumbsComponent} from './breadcrumbs.component';

@Component({
    selector: 'windup-app',
    templateUrl: 'app/components/app.component.html',
    directives: [NavbarComponent, BreadCrumbsComponent]
})
export class AppComponent {
}