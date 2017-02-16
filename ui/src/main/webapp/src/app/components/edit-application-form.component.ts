import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {RegisteredApplication, RegistrationType} from "windup-services";
import {RegisteredApplicationService} from "../services/registered-application.service";
import {FileExistsValidator} from "../validators/file-exists.validator";
import {FileService} from "../services/file.service";
import {Constants} from "../constants";
import {RegisterApplicationFormComponent} from "./register-application-form.component";
import {RouteFlattenerService} from "../services/route-flattener.service";

@Component({
    templateUrl: './register-application-form.component.html'
})
export class EditApplicationFormComponent extends RegisterApplicationFormComponent implements OnInit {

    constructor(
        _router:Router,
        _activatedRoute: ActivatedRoute,
        _fileService:FileService,
        _registeredApplicationService:RegisteredApplicationService,
        _formBuilder: FormBuilder,
        _routeFlattener: RouteFlattenerService
    ) {
        super(_router, _activatedRoute, _fileService, _registeredApplicationService, _formBuilder, _routeFlattener);
        this.multipartUploader = _registeredApplicationService.getMultipartUploader();
    }

    ngOnInit():any {
        super.ngOnInit();

        this.isAllowUploadMultiple = false;

        this.registrationForm = this._formBuilder.group({
            appPathToRegister: ["", Validators.compose([Validators.required, Validators.minLength(4)]), FileExistsValidator.create(this._fileService)]
        });

        this._activatedRoute.data.subscribe((data: {application: RegisteredApplication}) => {
            this.application = data.application;
            this.mode = this.application.registrationType;
            this.fileInputPath = this.application.inputPath;
            this.multipartUploader.setOptions({
                url: Constants.REST_BASE + RegisteredApplicationService.REUPLOAD_APPLICATION_URL.replace('{appId}', this.application.id.toString()),
                disableMultipart: false,
                method: 'PUT'
            });
        });
    }

    // @Override
    register() {
        if (this.mode == "PATH") {
            this.application.inputPath = this.fileInputPath;
            this._registeredApplicationService.updateByPath(this.application).subscribe(
                application => this.rerouteToApplicationList(),
                error => this.handleError(<any>error)
            );
        } else {
            if (this.multipartUploader.getNotUploadedItems().length > 0) {
                this._registeredApplicationService.updateByUpload(this.application).subscribe(
                    application => this.rerouteToApplicationList(),
                    error => this.handleError(<any>error)
                );
            } else {
                this.handleError("Please select file first");
            }
        }
        return false;
    }
}
