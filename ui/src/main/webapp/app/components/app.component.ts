import {Component} from '@angular/core';
import {NavbarComponent} from './navbar.component';
import {BreadCrumbsComponent} from './breadcrumbs.component';
import {ApplicationListComponent} from './applicationlist.component';
import {RegisterApplicationFormComponent} from "./registerapplicationform.component";
import {MigrationProjectFormComponent} from "./migrationprojectform.component";
import {ProjectListComponent} from "./projectlist.component";
import {GroupListComponent} from "./grouplist.component";
import {ApplicationGroupForm} from "./applicationgroupform.component";
import {AnalysisContextFormComponent} from "./analysiscontextform.component";

@Component({
    selector: 'windup-app',
    templateUrl: 'app/components/app.component.html',
    directives: [NavbarComponent, BreadCrumbsComponent]
})
export class AppComponent {
}