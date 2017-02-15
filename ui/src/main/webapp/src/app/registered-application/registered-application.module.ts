import {NgModule} from "@angular/core";
import {ApplicationResolve} from "./application.resolve";
import {RegisteredApplicationService} from "./registered-application.service";
import {EditApplicationFormComponent} from "./edit-application-form.component";
import {RegisterApplicationFormComponent} from "./register-application-form.component";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import {ApplicationListComponent} from "./application-list.component";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([])
    ],
    declarations: [
        EditApplicationFormComponent,
        RegisterApplicationFormComponent,
        ApplicationListComponent
    ],
    exports: [
        EditApplicationFormComponent,
        RegisterApplicationFormComponent,
        ApplicationListComponent
    ],
    providers: [
        ApplicationResolve,
        RegisteredApplicationService
    ]
})
export class ApplicationModule {
}
