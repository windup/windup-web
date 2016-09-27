import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule, RequestOptions, XHRBackend, Http} from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import 'rxjs/Rx';

import {FileSelectDirective, FileDropDirective, FileUploader} from 'ng2-file-upload/ng2-file-upload';
//import {FileSelectDirective} from "./components/file-upload/file-select.directive";
//import {FileDropDirective} from "./components/file-upload/file-drop.directive";

import { AppComponent }  from './components/app.component';
import { Constants } from './constants';
import { routing, appRoutingProviders } from './app.routing';

import {ProjectListComponent} from "./components/projectlist.component";
import {AnalysisContextFormComponent} from "./components/analysiscontextform.component";
import {ApplicationGroupForm} from "./components/applicationgroupform.component";
import {GroupListComponent} from "./components/grouplist.component";
import {MigrationProjectFormComponent} from "./components/migrationprojectform.component";
import {RegisterApplicationFormComponent} from "./components/registerapplicationform.component";
import {ProgressBarComponent} from "./components/progressbar.component";
import {NavbarComponent} from "./components/navbar.component";
import {BreadCrumbsComponent} from "./components/breadcrumbs.component";
import {ConfigurationService} from "./services/configuration.service";
import {AnalysisContextService} from "./services/analysiscontext.service";
import {ApplicationGroupService} from "./services/applicationgroup.service";
import {FileService} from "./services/file.service";
import {MigrationPathService} from "./services/migrationpath.service";
import {MigrationProjectService} from "./services/migrationproject.service";
import {RegisteredApplicationService} from "./services/registeredapplication.service";
import {WindupService} from "./services/windup.service";
import {RuleService} from "./services/rule.service";
import {ConfigurationComponent} from "./components/configuration.component";
import {TechnologyComponent} from "./components/technology.component";
import {RulesModalComponent} from "./components/rules-modal.component";
import {AddRulesPathModalComponent} from "./components/add-rules-path-modal.component";
import {ConfirmationModalComponent} from "./components/confirmation-modal.component";
import {KeycloakService} from "./services/keycloak.service";
import {WindupHttpService} from "./services/windup.http.service";
import {EditApplicationFormComponent} from "./components/edit-application-form.component";

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
        ConfigurationComponent,
        GroupListComponent,
        MigrationProjectFormComponent,
        ProjectListComponent,
        RegisterApplicationFormComponent,
        EditApplicationFormComponent,

        AddRulesPathModalComponent,
        BreadCrumbsComponent,
        ConfirmationModalComponent,
        NavbarComponent,
        ProgressBarComponent,
        RulesModalComponent,
        TechnologyComponent,
        
        FileSelectDirective,
        FileDropDirective
    ],
    providers: [
        appRoutingProviders,
        KeycloakService,
        AnalysisContextService,
        ApplicationGroupService,
        ConfigurationService,
        FileService,
        MigrationPathService,
        MigrationProjectService,
        RegisteredApplicationService,
        RuleService,
        WindupService,

        {
            provide: Http,
            useFactory:
                (
                    backend: XHRBackend,
                    defaultOptions: RequestOptions,
                    keycloakService: KeycloakService
                ) => new WindupHttpService(backend, defaultOptions, keycloakService),
            deps: [XHRBackend, RequestOptions, KeycloakService]
        }
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
