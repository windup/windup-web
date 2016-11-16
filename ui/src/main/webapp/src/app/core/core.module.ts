import {NgModule, Optional, SkipSelf} from "@angular/core";
import {HttpModule, RequestOptions, XHRBackend, Http} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import "rxjs/Rx";

import {KeycloakService} from "./authentication/keycloak.service";
import {WindupHttpService} from "./authentication/windup.http.service";
import {NotificationService} from "./notification/notification.service";
import {LoginComponent} from "./authentication/login.component";
import {LoggedInGuard} from "./authentication/logged-in.guard";
import {CoreRoutingModule} from "./core-routing.module";
import {RouteFlattenerService} from "./route-flattenner.service";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        CoreRoutingModule
    ],
    declarations: [
        LoginComponent,
    ],
    providers: [
        KeycloakService,
        NotificationService,
        LoggedInGuard,
        RouteFlattenerService,
        {
            provide: Http,
            useFactory: (backend: XHRBackend,
                         defaultOptions: RequestOptions,
                         keycloakService: KeycloakService) => new WindupHttpService(backend, defaultOptions, keycloakService),
            deps: [XHRBackend, RequestOptions, KeycloakService]
        }
    ]
})
export class CoreModule {
    constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}
