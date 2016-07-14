import {ControlGroup, FormBuilder, NgClass, NgControlName, Validators} from "@angular/common";
import {Component, Input, OnInit} from "@angular/core";
import {Router} from "@angular/router-deprecated";

import {MigrationProjectModel} from "../models/MigrationProject.model";
import {MigrationProjectService} from "../services/migrationproject.service";
import {FileService} from "../services/file.service";

@Component({
    selector: 'create-migration-project-form',
    templateUrl: 'app/templates/MigrationProject-create-form.component.html',
    directives: [ NgClass ],
    providers: [ FileService, MigrationProjectService ]
})
export class MigrationProjectFormComponent
{
    registrationForm: ControlGroup;

    model = new MigrationProjectModel();
    errorMessage: string;
    error: boolean;

    constructor(
        private _router: Router,
        private _migrationProjectService: MigrationProjectService,
        private _formBuilder: FormBuilder
    ) {
        this.registrationForm = this._formBuilder.group({
            title: ["", Validators.compose([Validators.required, Validators.minLength(4)])]
        });
        this.error = true;
    }

    create() {
        console.log("Creating migration project: " + this.model.title);
        this._migrationProjectService.createMigrationProject(this.model).subscribe(
            migrationProject => this.rerouteToApplicationList(),
            error => this.handleError(<any> error)
        );
    }

    private handleError(error: any) {
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

    cancel() {
        this.rerouteToApplicationList();
    }
}