import {Component, Input, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

import {RegisteredApplication} from "windup-services";
import {RegisteredApplicationService} from "../services/registeredapplication.service";
import {FileExistsValidator} from "../validators/file-exists.validator";
import {FileService} from "../services/file.service";
import {ApplicationGroupService} from "../services/applicationgroup.service";
import {ApplicationGroup} from "windup-services";
import {FormComponent} from "./formcomponent.component";

@Component({
    templateUrl: './registerapplicationform.component.html'
})
export class RegisterApplicationFormComponent extends FormComponent implements OnInit {
    registrationForm: FormGroup;

    applicationGroup:ApplicationGroup;
    model = <RegisteredApplication>{};
    loading:boolean = true;

    constructor(
        private _router:Router,
        private _activatedRoute: ActivatedRoute,
        private _fileService:FileService,
        private _registeredApplicationService:RegisteredApplicationService,
        private _applicationGroupService:ApplicationGroupService,
        private _formBuilder: FormBuilder
    ) {
        super();
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
                    group => { this.applicationGroup = group; this.loading = false }
                );
            } else {
                this.loading = false;
            }
        });
    }

    register() {
        console.log("Registering application: " + this.model.inputPath);

        this.model.applicationGroup = this.applicationGroup;

        this._registeredApplicationService.registerApplication(this.model).subscribe(
            application => this.rerouteToApplicationList(),
            error => this.handleError(<any>error)
        );
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