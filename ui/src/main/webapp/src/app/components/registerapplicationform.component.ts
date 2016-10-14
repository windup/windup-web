import {Component, Input, OnInit, ElementRef, Renderer, NgZone} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';

import {RegisteredApplication} from "windup-services";
import {RegisteredApplicationService} from "../services/registeredapplication.service";
import {FileExistsValidator} from "../validators/file-exists.validator";
import {FileService} from "../services/file.service";
import {ApplicationGroupService} from "../services/applicationgroup.service";
import {ApplicationGroup} from "windup-services";
import {FormComponent} from "./formcomponent.component";
import {Constants} from "../constants";

@Component({
    templateUrl: 'registerapplicationform.component.html'
})
export class RegisterApplicationFormComponent extends FormComponent implements OnInit {
    registrationForm: FormGroup;

    applicationGroup:ApplicationGroup;
    application: RegisteredApplication;
    loading:boolean = true;
    multipartUploader: FileUploader;
    mode:string = "UPLOADED";
    fileInputPath:string;
    isMultiple: boolean = true;
    isDirectory: boolean = false;

    modeChanged(newMode:string) {
        this.mode = newMode;
    }

    protected labels = {
        heading: 'Register Application',
        submitButton: 'Register'
    };

    constructor(
        protected _router:Router,
        protected _activatedRoute: ActivatedRoute,
        protected _fileService:FileService,
        protected _registeredApplicationService:RegisteredApplicationService,
        protected _applicationGroupService:ApplicationGroupService,
        protected _formBuilder: FormBuilder
    ) {
        super();
        this.multipartUploader = _registeredApplicationService.getMultipartUploader();
    }

    ngOnInit():any {
        this.registrationForm = this._formBuilder.group({
            inputPath: ["", Validators.compose([Validators.required, Validators.minLength(4)]), FileExistsValidator.create(this._fileService)],
            isDirectory: []
        });

        this._activatedRoute.params.subscribe(params => {
            let id:number = parseInt(params["groupID"]);
            if (!isNaN(id)) {
                this.loading = true;
                this._applicationGroupService.get(id).subscribe(
                    group => {
                        this.applicationGroup = group;
                        this.loading = false;
                        this.multipartUploader.setOptions({
                            url: Constants.REST_BASE + RegisteredApplicationService.REGISTER_APPLICATION_URL + group.id,
                            method: 'POST',
                            disableMultipart: false
                        });
                    }
                );
            } else {
                this.loading = false;
            }
        });
    }

    registerByPath() {
        console.log("Registering path: " + this.fileInputPath);

        if (this.isDirectory) {
            this._registeredApplicationService.registerApplicationInDirectoryByPath(this.applicationGroup.id, this.fileInputPath)
                .subscribe(
                    application => this.rerouteToApplicationList(),
                    error => this.handleError(error)
                );
        } else {
            this._registeredApplicationService.registerByPath(this.applicationGroup.id, this.fileInputPath).subscribe(
                application => this.rerouteToApplicationList(),
                error => this.handleError(<any>error)
            )
        }
    }

    register() {
        if (this.mode == "PATH") {
            this.registerByPath();
        } else {
            if (this.multipartUploader.getNotUploadedItems().length > 0) {
                this._registeredApplicationService.registerApplication(this.applicationGroup.id).subscribe(
                    application => this.rerouteToApplicationList(),
                    error => this.handleError(<any>error)
                );
            } else {
                this.handleError("Please select file first");
            }

            return false;
        }
    }

    rerouteToApplicationList() {
        this.multipartUploader.clearQueue();

        if (this.applicationGroup != null)
            this._router.navigate(['/group-list', { projectID: this.applicationGroup.migrationProject.id }]);
        else
            this._router.navigate(['/application-list']);
    }

    cancelRegistration() {
        this.rerouteToApplicationList();
    }
}
