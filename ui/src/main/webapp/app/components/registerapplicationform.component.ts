import {ControlGroup, FormBuilder, NgClass, NgControlName, Validators} from "@angular/common";
import {Component, Input, OnInit} from "@angular/core";
import {Router, RouteParams} from "@angular/router-deprecated";

import {RegisteredApplication} from "windup-services";
import {RegisteredApplicationService} from "../services/registeredapplication.service";
import {FileExistsValidator} from "../validators/FileExistsValidator";
import {FileService} from "../services/file.service";
import {ApplicationGroupService} from "../services/applicationgroup.service";
import {ApplicationGroup} from "windup-services";
import {FormComponent} from "./formcomponent.component";

@Component({
    templateUrl: 'app/components/registerapplicationform.component.html',
    directives: [ NgClass ],
    providers: [ FileService, RegisteredApplicationService, ApplicationGroupService ]
})
export class RegisterApplicationFormComponent extends FormComponent implements OnInit {
    registrationForm: ControlGroup;

    applicationGroup:ApplicationGroup;
    model = <RegisteredApplication>{};
    loading:boolean = true;
    errorMessages:string[];

    constructor(
        private _router:Router,
        private _routeParams: RouteParams,
        private _fileService:FileService,
        private _registeredApplicationService:RegisteredApplicationService,
        private _applicationGroupService:ApplicationGroupService,
        private _formBuilder: FormBuilder
    ) {
        super();
        this.registrationForm = _formBuilder.group({
            inputPath: ["", Validators.compose([Validators.required, Validators.minLength(4)]), FileExistsValidator.create(this._fileService)]
        });
    }

    ngOnInit():any {
        let id:number = parseInt(this._routeParams.get("groupID"));
        if (!isNaN(id)) {
            this.loading = true;
            this._applicationGroupService.get(id).subscribe(
                group => { this.applicationGroup = group; this.loading = false }
            );
        } else {
            this.loading = false;
        }
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
        this._router.navigate(['GroupList', { projectID: this.applicationGroup.migrationProject.id }]);
    }

    cancelRegistration() {
        this.rerouteToApplicationList();
    }
}