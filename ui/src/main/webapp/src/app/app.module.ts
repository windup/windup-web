import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import "rxjs/Rx";

import {appRoutes, AppRoutingModule} from "./app.routing";
import {CoreModule} from "./core/core.module";
import {AppComponent} from "./components/app.component";
import {RouteLinkProviderService} from "./core/route-link-provider-service";
import {SharedModule} from "./shared/shared.module";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        CoreModule,
        SharedModule,
        AppRoutingModule
    ],
    declarations: [
        // pages
        AppComponent
    ],
    providers: [
        {
            provide: RouteLinkProviderService,
            useFactory: () => {
                return new RouteLinkProviderService(appRoutes);
            }
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}
