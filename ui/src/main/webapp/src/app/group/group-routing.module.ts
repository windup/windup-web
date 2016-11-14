import {NgModule} from "@angular/core";

import "rxjs/Rx";

import {RouterModule} from "@angular/router";
import {GroupLayoutComponent} from "../shared/layout/group-layout.component";
import {ApplicationGroupResolve} from "./application-group.resolve";
import {ApplicationGroupForm} from "./applicationgroupform.component";
import {AnalysisContextFormComponent} from "./analysiscontextform.component";
import {ConfirmDeactivateGuard} from "../shared/confirm-deactivate.guard";
import {RegisterApplicationFormComponent} from "./application/registerapplicationform.component";
import {TechnologiesReportComponent} from "../reports/technologies/technologies.report";
import {MigrationIssuesComponent} from "../reports/migration-issues/migration-issues.component";

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: ':groupId',
            component: GroupLayoutComponent,
            resolve: {
                applicationGroup: ApplicationGroupResolve
            },
            children: [
                { path: '' },
                { path: 'edit', component: ApplicationGroupForm, data: {displayName: 'Edit Application Group'}},
                { path: 'analysis-context', component: AnalysisContextFormComponent, data: {displayName: "Edit Analysis Context"},
                    canDeactivate: [ConfirmDeactivateGuard]},
                { path: 'applications', children: [
                    { path: 'register', component: RegisterApplicationFormComponent, data: {displayName: "Application Registration"}},
                    { path: ':applicationId', children: [
                        { path: 'edit', component: RegisterApplicationFormComponent, data: {displayName: "Edit Application"}},
                    ]}
                ]},
                { path: 'reports', loadChildren: '../reports/reports.module#ReportsModule' },
            ]
        }
    ])],
    exports: [RouterModule]
})
export class GroupRoutingModule {

}
