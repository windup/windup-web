import {NgModule} from "@angular/core";

import "rxjs/Rx";

import {RouterModule} from "@angular/router";
import {TechnologiesReportComponent} from "./technologies/technologies.report";
import {MigrationIssuesComponent} from "./migration-issues/migration-issues.component";

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: ':executionId',
            children: [
                {path: 'technology-report', component: TechnologiesReportComponent, data: {displayName: 'Technology Report'}},
                {path: 'migration-issues', component: MigrationIssuesComponent}
            ]
        }
    ])],
    exports: [RouterModule]
})
export class ReportsRoutingModule {

}
