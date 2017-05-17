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
import {RuleProviderExecutionsComponent} from "./rule-provider-executions/rule-provider-executions.component";
import {RuleProviderExecutionsService} from "./rule-provider-executions/rule-provider-executions.service";

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
        RuleProviderExecutionsComponent,
    ],
    exports: [
        ActiveExecutionsProgressbarComponent,
        AllExecutionsComponent,
        ExecutionDetailComponent,
        ExecutionsListComponent,
        ProjectExecutionsComponent,
        ExecutionsLayoutComponent,
        RuleProviderExecutionsComponent,
    ],
    providers: [
        RuleProviderExecutionsService
    ]
})
export class ExecutionsModule {
}
