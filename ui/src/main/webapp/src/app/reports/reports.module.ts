import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import "rxjs/Rx";
import {MigrationIssuesComponent} from "./migration-issues/migration-issues.component";
import {MigrationIssuesTableComponent} from "./migration-issues/migration-issues-table.component";
import {MigrationIssuesService} from "./migration-issues/migration-issues.service";
import {TechReportService} from "./technologies/tech-report.service";
import {TechnologiesReportComponent} from "./technologies/technologies.report";
import {TechnologyComponent} from "../group/technology.component";
import {ReportsRoutingModule} from "./reports-routing.module";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ReportsRoutingModule
    ],
    declarations: [
        MigrationIssuesComponent,
        MigrationIssuesTableComponent,
        TechnologiesReportComponent
    ],
    providers: [
        MigrationIssuesService,
        TechReportService
    ]
})
export class ReportsModule {

}
