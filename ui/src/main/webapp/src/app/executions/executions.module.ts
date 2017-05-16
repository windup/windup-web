import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";

import {SharedModule} from "../shared/shared.module";
import {ActiveExecutionsProgressbarComponent} from "./active-executions-progressbar.component";
import {AllExecutionsComponent} from "./all-executions.component";
import {ExecutionDetailComponent} from "./execution-detail.component";
import {ExecutionsListComponent} from "./executions-list.component";
import {ProjectExecutionsComponent} from "./project-executions.component";
import {ExecutionsLayoutComponent} from "./executions-layout.component";
import {AnalysisContextModule} from "../analysis-context/analysis-context.module";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([]),
        AnalysisContextModule
    ],
    declarations: [
        ActiveExecutionsProgressbarComponent,
        AllExecutionsComponent,
        ExecutionDetailComponent,
        ExecutionsListComponent,
        ProjectExecutionsComponent,
        ExecutionsLayoutComponent,
    ],
    exports: [
        ActiveExecutionsProgressbarComponent,
        AllExecutionsComponent,
        ExecutionDetailComponent,
        ExecutionsListComponent,
        ProjectExecutionsComponent,
        ExecutionsLayoutComponent,
    ],
    providers: [
    ]
})
export class ExecutionsModule {
}
