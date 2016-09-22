import {Component, Input, OnInit} from "@angular/core";
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
import {KeycloakService} from "../services/keycloak.service";

@Component({
    templateUrl: 'app/components/registerapplicationform.component.html'
})
export class RegisterApplicationFormComponent extends FormComponent implements OnInit {
    registrationForm: FormGroup;

    applicationGroup:ApplicationGroup;
    model = <RegisteredApplication>{};
    loading:boolean = true;
    uploader: FileUploader;
    multipartUploader: FileUploader;

    constructor(
        private _router:Router,
        private _activatedRoute: ActivatedRoute,
        private _fileService:FileService,
        private _registeredApplicationService:RegisteredApplicationService,
        private _applicationGroupService:ApplicationGroupService,
        private _formBuilder: FormBuilder
    ) {
        super();
        this.uploader = _registeredApplicationService.getUploader();
        this.multipartUploader = _registeredApplicationService.getMultipartUploader();
    }

    ngOnInit():any {
        this.registrationForm = this._formBuilder.group({
            inputPath: ["", Validators.compose([Validators.required, Validators.minLength(4)]), FileExistsValidator.create(this._fileService)]
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
                            url: Constants.REST_BASE + "/registeredApplications/appGroup" + "/" + group.id,
                            authToken: 'Bearer ' + KeycloakService.auth.authz.token,
                            disableMultipart: false
                        });

                    }
                );
            } else {
                this.loading = false;
            }
        });
    }

    register() {
        if (this.multipartUploader.getNotUploadedItems().length > 0) {
            console.log("Registering application: " + this.model.inputPath);

            this._registeredApplicationService.registerApplication(this.applicationGroup.id).subscribe(
                application => this.rerouteToApplicationList(),
                error => this.handleError(<any>error)
            );
        } else {
            this.handleError("Please select file first");
        }

        return false;
    }

    rerouteToApplicationList() {
        if (this.applicationGroup != null)
            this._router.navigate(['/group-list', { projectID: this.applicationGroup.migrationProject.id }]);
        else
            this._router.navigate(['/application-list']);
    }

    cancelRegistration() {
        this.rerouteToApplicationList();
    }
}