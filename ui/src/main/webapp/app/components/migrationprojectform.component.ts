import {ControlGroup, FormBuilder, NgClass, NgControlName, Validators} from "@angular/common";
import {Component, Input, OnInit} from "@angular/core";
import {Router, RouteParams} from "@angular/router-deprecated";

import {MigrationProjectService} from "../services/migrationproject.service";
import {FileService} from "../services/file.service";
import {MigrationProject} from "windup-services";

@Component({
    selector: 'create-migration-project-form',
    templateUrl: 'app/components/migrationprojectform.component.html',
    directives: [ NgClass ],
    providers: [ FileService, MigrationProjectService ]
})
export class MigrationProjectFormComponent implements OnInit
{
    registrationForm: ControlGroup;

    model:MigrationProject = <MigrationProject>{};

    editMode:boolean = false;
    loading:boolean = false;

    errorMessages: string[];

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _migrationProjectService: MigrationProjectService,
        private _formBuilder: FormBuilder
    ) {
        this.registrationForm = this._formBuilder.group({
            title: ["", Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(128)])]
        });
    }

    ngOnInit() {
        let id:number = parseInt(this._routeParams.get("projectID"));
        if (!isNaN(id)) {
            this.editMode = true;
            this.loading = true;
            this._migrationProjectService.getMigrationProject(id).subscribe(
                model => { this.model = model; this.loading = false },
                error => this.handleError(<any> error)
            );
        }
    }

    save() {
        if (this.editMode) {
            console.log("Updating migration project: " + this.model.title);
            this._migrationProjectService.updateMigrationProject(this.model).subscribe(
                migrationProject => this.rerouteToApplicationList(),
                error => this.handleError(<any> error)
            );
        } else {
            console.log("Creating migration project: " + this.model.title);
            this._migrationProjectService.createMigrationProject(this.model).subscribe(
                migrationProject => this.rerouteToApplicationList(),
                error => this.handleError(<any> error)
            );
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

    private handleError(error: any) {
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
        this._router.navigate(['ProjectList']);
    }

    cancel() {
        this.rerouteToApplicationList();
    }
}