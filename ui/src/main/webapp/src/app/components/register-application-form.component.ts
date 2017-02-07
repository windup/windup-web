import { Component, Input, OnInit, ElementRef, Renderer, NgZone, OnDestroy, AfterViewInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {FileUploader} from "ng2-file-upload/ng2-file-upload";

import {RegisteredApplication, RegistrationType} from "windup-services";
import {RegisteredApplicationService} from "../services/registered-application.service";
import {FileExistsValidator} from "../validators/file-exists.validator";
import {FileService} from "../services/file.service";
import {ApplicationGroupService} from "../services/application-group.service";
import {ApplicationGroup} from "windup-services";
import {FormComponent} from "./form.component";
import {Constants} from "../constants";


//export type AppRegisterMode = "UPLOAD" | "REGISTER_PATH";

@Component({
    templateUrl: "./register-application-form.component.html"
})
export class RegisterApplicationFormComponent extends FormComponent implements OnInit, OnDestroy, AfterViewInit
{
    protected registrationForm: FormGroup;
    private applicationGroup:  ApplicationGroup;
    protected application:       RegisteredApplication;
    protected multipartUploader: FileUploader;
    protected mode:              RegistrationType = "UPLOADED";
    protected fileInputPath:     string;
    private isDirectory:       boolean = false;
    protected isAllowUploadMultiple: boolean = true;

    protected labels = {
        heading: "Register Application",
        submitButton: "Upload"
    };

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
            console.warn("tab click", this, event);
            event.preventDefault();
            $(this).tab("show");
        })
    }

    ngOnInit(): any {
        /*
	$("#addAppModeTabs  li").click(function(){
            console.warn("tab click", this, event);
            var tabID = $(this).attr("data-tab");

            $("#addAppModeTabs li").removeClass("active");
            $("#addAppsModeTabsContent").removeClass("active");

            $(this).addClass("active");
            $("#"+tabID).addClass("active");
	})
        */

        this.registrationForm = this._formBuilder.group({
            appPathToRegister: ["", Validators.compose([Validators.required, Validators.minLength(4)]), FileExistsValidator.create(this._fileService)],
            isDirectory: []
        });

        /*
         * parent.parent is workaround for this issue: https://github.com/angular/angular/issues/12767
         */
        this._activatedRoute.parent.parent.data.subscribe((data: {applicationGroup: ApplicationGroup}) => {
            this.applicationGroup = data.applicationGroup;
            this.multipartUploader.setOptions({
                url: Constants.REST_BASE + RegisteredApplicationService.REGISTER_APPLICATION_URL + this.applicationGroup.id,
                method: "POST",
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
            this.registerUploaded()
            return false;
        }
    }



    private registerPath() {
        console.log("Registering path: " + this.fileInputPath);

        if (this.isDirectory) {
            this._registeredApplicationService.registerApplicationInDirectoryByPath(this.applicationGroup, this.fileInputPath)
                .subscribe(
                    application => this.rerouteToApplicationList(),
                    error => this.handleError(error)
                );
        } else {
            this._registeredApplicationService.registerByPath(this.applicationGroup, this.fileInputPath).subscribe(
                application => this.rerouteToApplicationList(),
                error => this.handleError(<any>error)
            )
        }
    }

    private registerUploaded() {
        if (this.multipartUploader.getNotUploadedItems().length == 0) {
            this.handleError("Please select file first");
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
}
