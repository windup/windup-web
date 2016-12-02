import {Component, Input, OnInit, ElementRef, Renderer, NgZone} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';

import {RegisteredApplication} from "../windup-services";
import {RegisteredApplicationService} from "../services/registered-application.service";
import {FileExistsValidator} from "../validators/file-exists.validator";
import {FileService} from "../services/file.service";
import {ApplicationGroupService} from "../services/application-group.service";
import {ApplicationGroup} from "../windup-services";
import {FormComponent} from "./form.component";
import {Constants} from "../constants";

@Component({
    templateUrl: 'register-application-form.component.html'
})
export class RegisterApplicationFormComponent extends FormComponent implements OnInit {
    registrationForm: FormGroup;

    applicationGroup: ApplicationGroup;
    application: RegisteredApplication;
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

        /*
         * parent.parent is workaround for this issue: https://github.com/angular/angular/issues/12767
         */
        this._activatedRoute.parent.parent.data.subscribe((data: {applicationGroup: ApplicationGroup}) => {
            this.applicationGroup = data.applicationGroup;
            this.multipartUploader.setOptions({
                url: Constants.REST_BASE + RegisteredApplicationService.REGISTER_APPLICATION_URL + this.applicationGroup.id,
                method: 'POST',
                disableMultipart: false
            });
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
        this._router.navigate([`/projects/${this.applicationGroup.migrationProject.id}/groups/${this.applicationGroup.id}`]);
    }

    cancelRegistration() {
        this.rerouteToApplicationList();
    }
}
