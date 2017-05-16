import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {Http, HttpModule, RequestOptions, XHRBackend} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DatePipe} from "@angular/common";

import "rxjs/Rx";

import {AppComponent} from "./components/app.component";
import {appRoutes, appRoutingProviders, routing} from "./app.routing";

import {ApplicationListComponent} from "./registered-application/application-list.component";
import {RegisterApplicationFormComponent} from "./registered-application/register-application-form.component";
import {RegisteredApplicationService} from "./registered-application/registered-application.service";
import {ApplicationResolve} from "./registered-application/application.resolve";
import {ApplicationQueueListComponent} from "./registered-application/application-queue-list.component";
import {EditApplicationFormComponent} from "./registered-application/edit-application-form.component";

import {MomentModule} from "angular2-moment";
import {FileUploader, FileUploadModule} from "ng2-file-upload";
import {NgxChartsModule} from "@swimlane/ngx-charts";

import {ProjectExecutionsComponent} from "./executions/project-executions.component";
import {ExecutionDetailComponent} from "./executions/execution-detail.component";
import {ExecutionsLayoutComponent} from "./executions/executions-layout.component";
import {ExecutionResolve} from "./executions/execution.resolve";
import {ExecutionsListComponent} from "./executions/executions-list.component";
import {AllExecutionsComponent} from "./executions/all-executions.component";
import {ActiveExecutionsProgressbarComponent} from "./executions/active-executions-progressbar.component";

import {InViewport} from "./components/in-viewport.directive";

import {AboutPageComponent} from "./misc/about.component";

import {FileService} from "./services/file.service";
import {WindupService} from "./services/windup.service";
import {FramesRestClientService} from "./services/graph/frames-rest-client.service";
import {GraphJSONToModelService} from "./services/graph/graph-json-to-model.service";
import {FileModelService} from "./services/graph/file-model.service";
import {ClassificationService} from "./services/graph/classification.service";
import {HintService} from "./services/graph/hint.service";
import {WindupExecutionService} from "./services/windup-execution.service";

import {initializeModelMappingData} from "./generated/tsModels/discriminator-mapping-data";

import {ProjectModule} from "./project/project.module";
import {ApplicationModule} from "./registered-application/registered-application.module";
import {ConfigurationModule} from "./configuration/configuration.module";
import {AnalysisContextModule} from "./analysis-context/analysis-context.module";
import {SharedModule} from "./shared/shared.module";
import {CoreModule} from "./core/core.module";

/**
 * Load all mapping data from the generated files.
 */
initializeModelMappingData();

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing,

        FileUploadModule,

        // NGX Charts
        NgxChartsModule,

        // Moment
        MomentModule,

        CoreModule,
        SharedModule,
        ProjectModule,
        GroupModule,
        ApplicationModule,
        ConfigurationModule,
        AnalysisContextModule
    ],
    declarations: [
        // Directives
        InViewport,

        // pages
        AppComponent,
        RegisterApplicationFormComponent,
        EditApplicationFormComponent,

        // Reports

        // Report components

        // Components
        ExecutionsLayoutComponent,
        ExecutionsListComponent,
        AllExecutionsComponent,
        ActiveExecutionsProgressbarComponent,
        ExecutionDetailComponent,
        ApplicationListComponent,
        ProjectExecutionsComponent,
        AboutPageComponent,
        ApplicationQueueListComponent,
    ],
    providers: [
        appRoutingProviders,
        FileService,
        RegisteredApplicationService,
        WindupService,
        FileModelService,
        ClassificationService,
        HintService,
        FramesRestClientService,
        ApplicationResolve,
        WindupExecutionService,
        ExecutionResolve,
        {
            provide: FileUploader,
            useFactory: createFileUploader
        },
        {
            provide: GraphJSONToModelService,
            useFactory: createGraphJSONToModelService,
            deps: [Http]
        },
        DatePipe
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }

let fileUploader = null;
export function createFileUploader() {
    if (fileUploader != null)
        return fileUploader;

    fileUploader = new FileUploader({});
    return fileUploader;
}

export function createGraphJSONToModelService(http: Http) {
    return new GraphJSONToModelService(http, null);
}

export class WINDUP_WEB {
    public static config = {
        // Hide the unfinished features in production mode.
        // TODO: Use process.env.ENV !== 'production' when AOT is fixed.
        // process is not accessible here. Supposedly the references to env vars should be replaced by WebPack but they are not.
        //hideUnfinishedFeatures: (process.env.hideUnfinishedFeatures !== (void 0)) ? process.env.hideUnfinishedFeatures : true;
        hideUnfinishedFeatures: true
    };
}

WINDUP_WEB.config = { hideUnfinishedFeatures: true };
