import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgZone, provide } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppComponent }  from './components/app.component';
import { Constants } from './constants';
import { routing, appRoutingProviders } from './app.routing';

import 'rxjs/Rx';
import {ProjectListComponent} from "./components/projectlist.component";
import {AnalysisContextFormComponent} from "./components/analysiscontextform.component";
import {ApplicationGroupForm} from "./components/applicationgroupform.component";
import {GroupListComponent} from "./components/grouplist.component";
import {MigrationProjectFormComponent} from "./components/migrationprojectform.component";
import {RegisterApplicationFormComponent} from "./components/registerapplicationform.component";
import {ProgressBarComponent} from "./components/progressbar.component";
import {NavbarComponent} from "./components/navbar.component";
import {BreadCrumbsComponent} from "./components/breadcrumbs.component";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing
    ],
    declarations: [
        AppComponent,
        AnalysisContextFormComponent,
        ApplicationGroupForm,
        GroupListComponent,
        MigrationProjectFormComponent,
        ProjectListComponent,
        RegisterApplicationFormComponent,

        BreadCrumbsComponent,
        NavbarComponent,
        ProgressBarComponent,
    ],
    providers:    [ Constants, appRoutingProviders ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
