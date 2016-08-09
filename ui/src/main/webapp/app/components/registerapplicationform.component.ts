import {ControlGroup, FormBuilder, NgClass, NgControlName, Validators} from "@angular/common";
import {Component, Input, OnInit} from "@angular/core";
import {Router, RouteParams} from "@angular/router-deprecated";

import {RegisteredApplication} from "windup-services";
import {RegisteredApplicationService} from "../services/registeredapplication.service";
import {FileExistsValidator} from "../validators/FileExistsValidator";
import {FileService} from "../services/file.service";
import {ApplicationGroupService} from "../services/applicationgroup.service";
import {ApplicationGroup} from "windup-services";

@Component({
    templateUrl: 'app/components/registerapplicationform.component.html',
    directives: [ NgClass ],
    providers: [ FileService, RegisteredApplicationService, ApplicationGroupService ]
})
export class RegisterApplicationFormComponent implements OnInit {
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

    /**
     * This works simplifies the process of checking for an error state on the control.
     *
     * It makes sure that the control is not-pristine (don't show errors on fields the user hasn't touched yet)
     * and that the control is already rendered.
     */
    hasError(control:NgControlName) {
        let touched = control.touched == null ? false : control.touched;
        return !control.valid && touched && control.control != null;
    }

    register() {
        console.log("Registering application: " + this.model.inputPath);

        this.model.applicationGroup = this.applicationGroup;

        this._registeredApplicationService.registerApplication(this.model).subscribe(
            application => this.rerouteToApplicationList(),
            error => this.handleRegistrationError(<any>error)
        );
    }

    private handleRegistrationError(error:any) {
        this.errorMessages = [];
        if (error.parameterViolations) {
            error.parameterViolations.forEach(violation =>
            {
                console.log("Violation: " + JSON.stringify(violation));
                this.errorMessages.push(violation.message);
            });
        } else
        {
            this.errorMessages.push("Error: " + error);
        }
    }

    rerouteToApplicationList() {
        this._router.navigate(['GroupList', { projectID: this.applicationGroup.migrationProject.id }]);
    }

    cancelRegistration() {
        this.rerouteToApplicationList();
    }
}