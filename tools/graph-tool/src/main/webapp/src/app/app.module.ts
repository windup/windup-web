import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DatePipe} from "@angular/common";

import {AppComponent} from "./components/app.component";

import {MomentModule} from "angular2-moment";

import {InViewport} from "./components/in-viewport.directive";
import {Http, HttpModule, RequestOptions, XHRBackend} from "@angular/http";
import {WindupHttpService} from "./components/windup.http.service";
import {KeycloakService} from "./authentication/keycloak.service";

/**
 * Load all mapping data from the generated files.
 */

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,

        // Moment
        MomentModule,

    ],
    declarations: [
        // Directives
        InViewport,

        // pages
        AppComponent,

    ],
    providers: [
        DatePipe,
        KeycloakService,
        // WindupHttpService's entry
        {
            provide: Http,
            useFactory: windupHttpServiceFactory,
            deps: [XHRBackend, RequestOptions, KeycloakService]
        },
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }


export function windupHttpServiceFactory(backend: XHRBackend,
                                         defaultOptions: RequestOptions,
                                         keycloakService: KeycloakService,
) {
    return new WindupHttpService(backend, defaultOptions, keycloakService);
}
