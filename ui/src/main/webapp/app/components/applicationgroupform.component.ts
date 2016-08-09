import {ControlGroup, FormBuilder, NgClass, NgControlName, Validators} from "@angular/common";
import {Component, Input, OnInit} from "@angular/core";
import {Router, RouteParams} from "@angular/router-deprecated";

import {ApplicationGroup, MigrationProject} from "windup-services";
import {ApplicationGroupService} from "../services/applicationgroup.service";
import {MigrationProjectService} from "../services/migrationproject.service";

@Component({
    selector: 'create-group-form',
    templateUrl: 'app/components/applicationgroupform.component.html',
    directives: [ NgClass ],
    providers: [ ApplicationGroupService, MigrationProjectService ]
})
export class ApplicationGroupForm implements OnInit
{
    registrationForm: ControlGroup;

    project:MigrationProject;
    model:ApplicationGroup = <ApplicationGroup>{};

    editMode:boolean = false;

    loadingProject:boolean = false;
    loadingGroup:boolean = false;

    get loading():boolean {
        return this.loadingProject || this.loadingGroup;
    }

    errorMessages: string[];

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _migrationProjectService: MigrationProjectService,
        private _applicationGroupService: ApplicationGroupService,
        private _formBuilder: FormBuilder
    ) {
        this.registrationForm = this._formBuilder.group({
            title: ["", Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(128)])]
        });
    }

    ngOnInit() {
        let projectID = parseInt(this._routeParams.get("projectID"));

        if (!isNaN(projectID)) {
            this.loadingProject = true;
            this._migrationProjectService.get(projectID).subscribe(
                model => { this.project = model; this.loadingProject = false },
                error => this.handleError(<any> error)
            );
        }

        let groupID = parseInt(this._routeParams.get("groupID"));
        if (!isNaN(groupID)) {
            this.editMode = true;
            this.loadingGroup = true;
            this._applicationGroupService.get(groupID).subscribe(
                model => {
                    this.model = model;
                    if (this.project == null)
                        this.project = this.model.migrationProject;
                    this.loadingGroup = false
                },
                error => this.handleError(<any> error)
            );
        }
    }

    save() {
        if (this.editMode) {
            console.log("Updating group: " + this.model.title);
            this.model.migrationProject = <MigrationProject>{};
            this.model.migrationProject.id = this.project.id;
            this._applicationGroupService.update(this.model).subscribe(
                migrationProject => this.rerouteToGroupList(),
                error => this.handleError(<any> error)
            );
        } else {
            console.log("Creating group: " + this.model.title);
            this.model.migrationProject = this.project;
            this._applicationGroupService.create(this.model).subscribe(
                migrationProject => this.rerouteToGroupList(),
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

    rerouteToGroupList() {
        this._router.navigate(['GroupList', {projectID: this.project.id}]);
    }

    cancel() {
        this.rerouteToGroupList();
    }
}