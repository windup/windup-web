import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DatePipe} from "@angular/common";

import {AppComponent} from "./components/app.component";

import {MomentModule} from "angular2-moment";
import {SlimLoadingBarModule} from "ng2-slim-loading-bar";

import {InViewport} from "./components/in-viewport.directive";
import {HttpModule} from "@angular/http";

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

        SlimLoadingBarModule.forRoot(),
    ],
    declarations: [
        // Directives
        InViewport,

        // pages
        AppComponent,

    ],
    providers: [
        DatePipe
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
