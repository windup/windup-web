import {NgModule} from "@angular/core";

import "rxjs/Rx";

import {RouterModule} from "@angular/router";
import {LoginComponent} from "./authentication/login.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'login', component: LoginComponent },
    ])],
    exports: [RouterModule]
})
export class CoreRoutingModule {

}
