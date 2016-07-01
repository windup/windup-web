import {ControlGroup, FormBuilder, NgClass, NgControlName, Validators} from "@angular/common";
import {Component, Input, OnInit} from "@angular/core";
import {Router} from "@angular/router-deprecated";

import {MigrationProjectModel} from "../models/MigrationProject.model";
import {MigrationProjectService} from "../services/migrationproject.service";
import {FileExistsValidator} from "../validators/FileExistsValidator";
import {FileService} from "../services/file.service";

@Component({
    selector: 'register-application-form',
    templateUrl: 'app/templates/MigrationProject-create-form.component.html',
    directives: [ NgClass ],
    providers: [ FileService, MigrationProjectService ]
})
export class MigrationProjectFormComponent
    {
    registrationForm: ControlGroup;

    model = new MigrationProjectModel();
    errorMessage:string;
    error:boolean;

    constructor(
        private _router: Router,
        private _fileService: FileService,
        private _migrationProjectService: MigrationProjectService,
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
        console.log("Creating migration project: " + this.model.title);
        this._migrationProjectService.createMigrationProject(this.model).subscribe(
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