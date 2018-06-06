import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DatePipe} from "@angular/common";

import {AppComponent} from "./components/app.component";
import {AppRoutingModule} from "./app-routing.module";

import {MomentModule} from "angular2-moment";
import {FileUploader, FileUploadModule} from "ng2-file-upload";

import {InViewport} from "./components/in-viewport.directive";

import {AboutPageComponent} from "./misc/about.component";

import {FileService} from "./services/file.service";
import {WindupService} from "./services/windup.service";
import {TechnologyTagService} from "./services/graph/technologytag.service";
import {FramesRestClientService} from "./services/graph/frames-rest-client.service";
import {GraphDiscriminatorMappingProviders, GraphJSONToModelService} from "./services/graph/graph-json-to-model.service";
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
import {ExecutionsModule} from "./executions/executions.module";
import {FileUploaderWrapper} from "./shared/upload/file-uploader-wrapper.service";
import {KeycloakService} from "./core/authentication/keycloak.service";

/**
 * Load all mapping data from the generated files.
 */
initializeModelMappingData();

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,

        FileUploadModule,

        // Moment
        MomentModule,

        CoreModule,
        SharedModule,
        ProjectModule,
        ApplicationModule,
        ConfigurationModule,
        AnalysisContextModule,
        ExecutionsModule,
    ],
    declarations: [
        // Directives
        InViewport,

        // pages
        AppComponent,

        // Components
        AboutPageComponent
    ],
    providers: [
        ClassificationService,
        FileModelService,
        FileService,
        FramesRestClientService,
        HintService,
        TechnologyTagService, 
        WindupExecutionService,
        {
            provide: FileUploader,
            useFactory: createFileUploader,
            deps: [KeycloakService]
        },
        WindupService,
        {
            provide: GraphJSONToModelService,
            useFactory: createGraphJSONToModelService,
            deps: [HttpClient]
        },
        DatePipe,
        GraphDiscriminatorMappingProviders
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }

let fileUploader = null;
export function createFileUploader(_keycloakService:KeycloakService) {
    if (fileUploader != null)
        return fileUploader;

    fileUploader = new FileUploaderWrapper({},_keycloakService);
    return fileUploader;
}

export function createGraphJSONToModelService(http: HttpClient) {
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
