import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, RequestOptions, XHRBackend, Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import 'rxjs/Rx';

import {FileSelectDirective, FileDropDirective, FileUploader} from 'ng2-file-upload/ng2-file-upload';
import { AppComponent }  from './components/app.component';
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
import {CustomRuleSelectionComponent} from "./components/custom-rule-selection.component";

import {KeycloakService} from "./services/keycloak.service";
import {WindupHttpService} from "./services/windup.http.service";
import {EditApplicationFormComponent} from "./components/edit-application-form.component";
import {UploadQueueComponent} from "./components/upload/upload-queue.component";
import {UploadProgressbarComponent} from "./components/upload/upload-progressbar.component";
import {AnalysisContextAdvancedOptionsModalComponent} from "./components/analysis-context-advanced-options-modal.component";
import {ConfigurationOptionsService} from "./services/configuration-options.service";
import {ModalDialogComponent} from "./components/modal-dialog.component";
import {NotificationService} from "./services/notification.service";
import {NotificationComponent} from "./components/notification.component";
import {ConfirmDeactivateGuard} from "./confirm-deactivate.guard";
import {PopoverComponent} from "./components/popover.component";
import {JsTreeAngularWrapperComponent} from "./components/js-tree-angular-wrapper.component";
import {PackageRegistryService} from "./services/package-registry.service";
import {TechnologiesReport} from "./components/reports/technologies/technologies.report";
import {LoginComponent} from "./components/login.component";
import {LoggedInGuard} from "./services/logged-in.guard";


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing
    ],
    declarations: [
        // pages
        AppComponent,
        AnalysisContextFormComponent,
        ApplicationGroupForm,
        ConfigurationComponent,
        GroupListComponent,
        MigrationProjectFormComponent,
        ProjectListComponent,
        RegisterApplicationFormComponent,
        EditApplicationFormComponent,

        // Reports
        TechnologiesReport,

        // Components
        AddRulesPathModalComponent,
        AnalysisContextAdvancedOptionsModalComponent,
        BreadCrumbsComponent,
        ConfirmationModalComponent,
        ModalDialogComponent,
        NavbarComponent,
        ProgressBarComponent,
        RulesModalComponent,
        TechnologyComponent,
        
        FileSelectDirective,
        FileDropDirective,
        UploadQueueComponent,
        UploadProgressbarComponent,
        CustomRuleSelectionComponent,
        NotificationComponent,
        PopoverComponent,
        JsTreeAngularWrapperComponent,
        LoginComponent
    ],
    providers: [
        appRoutingProviders,
        KeycloakService,
        AnalysisContextService,
        ApplicationGroupService,
        ConfigurationService,
        ConfigurationOptionsService,
        ConfirmDeactivateGuard,
        FileService,
        MigrationPathService,
        MigrationProjectService,
        RegisteredApplicationService,
        RuleService,
        WindupService,
        NotificationService,
        PackageRegistryService,
        LoggedInGuard,
        {
            provide: Http,
            useFactory:
                (
                    backend: XHRBackend,
                    defaultOptions: RequestOptions,
                    keycloakService: KeycloakService
                ) => new WindupHttpService(backend, defaultOptions, keycloakService),
            deps: [XHRBackend, RequestOptions, KeycloakService]
        },
        {
            provide: FileUploader,
            useValue: new FileUploader({})
        }
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
