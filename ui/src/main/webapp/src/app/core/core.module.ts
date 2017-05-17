import {NgModule, Optional, SkipSelf} from "@angular/core";
import {HttpModule, RequestOptions, XHRBackend, Http} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import {KeycloakService} from "./authentication/keycloak.service";
import {WindupHttpService} from "./authentication/windup.http.service";
import {NotificationService} from "./notification/notification.service";
import {LoggedInGuard} from "./authentication/logged-in.guard";
import {EventBusService} from "./events/event-bus.service";
import {RouteLinkProviderService} from "./routing/route-link-provider-service";
import {appRoutes} from '../app.routing';
import {RouteHistoryService} from "./routing/route-history.service";
import {RouteFlattenerService} from "./routing/route-flattener.service";

/**
 * Core module is for services which should be global app level singletons
 *
 * It is recommended to use core module only for services and avoid having components in it.
 *
 */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule
    ],
    providers: [
        KeycloakService,
        NotificationService,
        EventBusService,
        {
            provide: Http,
            useFactory: windupHttpServiceFactory,
            deps: [XHRBackend, RequestOptions, KeycloakService]
        },
        {
            provide: RouteLinkProviderService,
            useFactory: createRouteLinkProviderService
        },

        LoggedInGuard,
        RouteHistoryService,
        RouteFlattenerService
    ]
})
export class CoreModule {
    constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}

export function windupHttpServiceFactory(backend: XHRBackend,
                                          defaultOptions: RequestOptions,
                                          keycloakService: KeycloakService) {
    return new WindupHttpService(backend, defaultOptions, keycloakService);
}

export function createRouteLinkProviderService() {
    return new RouteLinkProviderService(appRoutes);
}
