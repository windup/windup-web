import {NgModule, Optional, SkipSelf} from "@angular/core";
import {HttpModule, RequestOptions, XHRBackend, Http} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";


import {KeycloakService} from "./authentication/keycloak.service";
import {WindupHttpService} from "./authentication/windup.http.service";
import {NotificationService} from "./notification/notification.service";
import {LoggedInGuard} from "./authentication/logged-in.guard";
import {EventBusService} from "./events/event-bus.service";
import {RouteLinkProviderService} from "./routing/route-link-provider-service";
import {appRoutes} from '../app-routing.module';
import {RouteHistoryService} from "./routing/route-history.service";
import {RouteFlattenerService} from "./routing/route-flattener.service";
import {LogoutGuard} from "./authentication/logout.guard";
import {UrlCleanerService} from "./routing/url-cleaner.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TokenInterceptor} from "./authentication/token.interceptor";
import {LoadingInterceptor} from "./loading/loading.interceptor";
import {ErrorInterceptor} from "./loading/error.interceptor";


/**
 * Core module is for services which should be global app level singletons
 *
 * It is recommended to use the core module only for services and avoid having components in it.
 * Putting components to tje code module would need it to be imported to use the component and thus instanticated multiple times.
 * Which would break the "contract" that the core module provides singleton services.
 */
@NgModule({
    // Other modules.
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        HttpClientModule,
        NoopAnimationsModule, // WINDUP-1579, needed since Angular 4
    ],
    providers: [
        KeycloakService,
        EventBusService,
        NotificationService,
        // WindupHttpService's entry
        {
            provide: Http,
            useFactory: windupHttpServiceFactory,
            deps: [XHRBackend, RequestOptions, KeycloakService, EventBusService]
        },
        {
            provide: RouteLinkProviderService,
            useFactory: createRouteLinkProviderService
        },

        LoggedInGuard,
        LogoutGuard,
        RouteHistoryService,
        RouteFlattenerService,
        UrlCleanerService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoadingInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        }
    ]
})
export class CoreModule {
    constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error("CoreModule is already loaded. It is imported only from the AppModule. Don't import it anywhere else.");
        }
    }
}

export function windupHttpServiceFactory(backend: XHRBackend,
                                          defaultOptions: RequestOptions,
                                          keycloakService: KeycloakService,
                                          eventBus: EventBusService,
) {
    return new WindupHttpService(backend, defaultOptions, keycloakService, eventBus);
}

export function createRouteLinkProviderService() {
    return new RouteLinkProviderService(appRoutes);
}
