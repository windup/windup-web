import { Component, OnInit, OnDestroy, AfterViewInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {FileUploader} from "ng2-file-upload/ng2-file-upload";

import {RegisteredApplication, RegistrationType} from "windup-services";
import {RegisteredApplicationService} from "../services/registered-application.service";
import {FileExistsValidator} from "../validators/file-exists.validator";
import {FileService} from "../services/file.service";
import {ApplicationGroup} from "windup-services";
import {FormComponent} from "./form.component";
import {Constants} from "../constants";
import {MigrationProject} from "windup-services";


@Component({
    templateUrl: "./register-application-form.component.html",
    styles: [`
        ul#addAppModeTabs.nav.nav-tabs  {
            font-size: 16px;
            background: none;
            border: none;
            border-bottom: 1px solid silver;
        }
        ul#addAppModeTabs.nav.nav-tabs li {
        }
        ul#addAppModeTabs.nav.nav-tabs li.active {
            border-bottom: 2px solid #0088ce;
        }
        ul#addAppModeTabs.nav.nav-tabs li:hover {
            border-bottom: 2px solid #008Fd8;
        }
        ul#addAppModeTabs.nav.nav-tabs li.active a {
            font-color: #0088ce;
            background: none;
            border: none;
            border-bottom: 2px solid #0088ce;
        }
        .filesDropArea { background-color: #FDFDFD !important; border-style: dashed; }

        .row.description,
        .description .alert { margin-bottom: 0px !important; }
    `]
})
export class RegisterApplicationFormComponent extends FormComponent implements OnInit, OnDestroy, AfterViewInit
{
    protected registrationForm: FormGroup;
    private applicationGroup: ApplicationGroup;
    protected application: RegisteredApplication;
    protected multipartUploader: FileUploader;
    protected mode: RegistrationType = "UPLOADED";
    protected fileInputPath: string;
    private isDirWithApps: boolean = false;
    protected isAllowUploadMultiple: boolean = true;

    project: MigrationProject;

    constructor(
        protected _router: Router,
        protected _activatedRoute: ActivatedRoute,
        protected _fileService: FileService,
        protected _registeredApplicationService: RegisteredApplicationService,
        protected _formBuilder: FormBuilder
    ) {
        super();
        this.multipartUploader = _registeredApplicationService.getMultipartUploader();
    }

    ngAfterViewInit(): any {
        $("#addAppModeTabs a").click(function (event) {
            event.preventDefault();
            $(this).tab("show");
        })
    }

    ngOnInit(): any {
        this.registrationForm = this._formBuilder.group({
            // Name under which the control is registered, default value, Validator, AsyncValidator
            appPathToRegister: ["", Validators.compose([Validators.required, Validators.minLength(4)]), FileExistsValidator.create(this._fileService)],
            isDirWithAppsCheckBox: [] // TODO: Validate if appPathToRegister has a directory if this is true.
        });

        /*
         * parent.parent is workaround for this issue: https://github.com/angular/angular/issues/12767
         */
        this._activatedRoute.parent.parent.data.subscribe((data: {applicationGroup: ApplicationGroup}) => {
            this.applicationGroup = data.applicationGroup;
            this.multipartUploader.setOptions({
                url: Constants.REST_BASE + RegisteredApplicationService.UPLOAD_URL.replace('{projectId}', this.project.id.toString()),
                method: 'POST',
                disableMultipart: false
            });
        });
    }

    ngOnDestroy(): void {
        this.multipartUploader.clearQueue();
    }

    protected register() {
        if (this.mode == "PATH") {
            this.registerPath();
        } else {
            this.registerUploaded();
            return false;
        }
    }



    private registerPath() {
        console.log("Registering path: " + this.fileInputPath);

        if (this.isDirWithApps) {
            this._registeredApplicationService.registerApplicationInDirectoryByPath(this.project, this.fileInputPath)
                .subscribe(
                    application => this.rerouteToApplicationList(),
                    error => this.handleError(error)
                );
        } else {
            this._registeredApplicationService.registerByPath(this.project, this.fileInputPath).subscribe(
                application => this.rerouteToApplicationList(),
                error => this.handleError(<any>error)
            )
        }
    }

    private registerUploaded() {
        if (this.multipartUploader.getNotUploadedItems().length == 0) {
            this.handleError("Please select the file to upload.");
            return;
        }

        this._registeredApplicationService.registerApplication(this.applicationGroup).subscribe(
            application => this.rerouteToApplicationList(),
            error => this.handleError(<any>error)
        );
    }

    protected rerouteToApplicationList() {
        this.multipartUploader.clearQueue();
        this._router.navigate([`/projects/${this.applicationGroup.migrationProject.id}/groups/${this.applicationGroup.id}`]);
    }

    private cancelRegistration() {
        this.rerouteToApplicationList();
    }

    private changeMode(mode: RegistrationType) {
        console.log("Changing mode to: " + mode);
        this.mode = mode;
    }
}
