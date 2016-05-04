import {ControlGroup, FormBuilder, NgClass, NgControlName, Validators} from "@angular/common";
import {Component, Input, OnInit} from "@angular/core";
import {Router} from "@angular/router-deprecated";

import {RegisteredApplicationModel} from "../models/registered.application.model";
import {RegisteredApplicationService} from "../services/registeredapplication.service";
import {FileExistsValidator} from "../validators/FileExistsValidator";
import {FileService} from "../services/file.service";

@Component({
    selector: 'register-application-form',
    templateUrl: 'app/templates/registerapplicationform.component.html',
    directives: [ NgClass ],
    providers: [ FileService, RegisteredApplicationService ]
})
export class RegisterApplicationFormComponent {
    registrationForm: ControlGroup;

    model = new RegisteredApplicationModel();
    errorMessage:string;
    error:boolean;

    constructor(
        private _router:Router,
        private _fileService:FileService,
        private _registeredApplicationService:RegisteredApplicationService,
        private _formBuilder: FormBuilder
    ) {
        this.registrationForm = _formBuilder.group({
            inputPath: ["", Validators.compose([Validators.required, Validators.minLength(4)]), FileExistsValidator.fileExists(this._fileService)]
        });
        this.error = true;
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
        this._registeredApplicationService.registerApplication(this.model).subscribe(
            application => this.rerouteToApplicationList(),
            error => this.handleRegistrationError(<any>error)
        );
    }

    private handleRegistrationError(error:any) {
        if (error.parameterViolations) {
            error.parameterViolations.forEach(violation =>
            {
                console.log("Violation: " + JSON.stringify(violation));
            });
        }
    }

    rerouteToApplicationList() {
        this._router.navigate(['ApplicationList']);
    }

    cancelRegistration() {
        this.rerouteToApplicationList();
    }
}