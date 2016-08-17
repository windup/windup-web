import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgZone, provide } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppComponent }  from './components/app.component';
import { Constants } from './constants';
import { routing, appRoutingProviders } from './app.routing';

import 'rxjs/Rx';
import {ApplicationListComponent} from "./components/applicationlist.component";
import {ProjectListComponent} from "./components/projectlist.component";
import {AnalysisContextFormComponent} from "./components/analysiscontextform.component";
import {ApplicationGroupForm} from "./components/applicationgroupform.component";
import {GroupListComponent} from "./components/grouplist.component";
import {MigrationProjectFormComponent} from "./components/migrationprojectform.component";
import {RegisterApplicationFormComponent} from "./components/registerapplicationform.component";

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
        ApplicationListComponent,
        GroupListComponent,
        MigrationProjectFormComponent,
        ProjectListComponent,
        RegisterApplicationFormComponent
    ],
    providers:    [ Constants, appRoutingProviders ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
