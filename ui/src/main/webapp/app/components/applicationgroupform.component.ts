import {ControlGroup, FormBuilder, NgClass, NgControlName, Validators} from "@angular/common";
import {Component, Input, OnInit} from "@angular/core";
import {Router, RouteParams} from "@angular/router-deprecated";

import {ApplicationGroup, MigrationProject} from "windup-services";
import {ApplicationGroupService} from "../services/applicationgroup.service";
import {MigrationProjectService} from "../services/migrationproject.service";
import {FormComponent} from "./formcomponent.component";

@Component({
    selector: 'create-group-form',
    templateUrl: 'app/components/applicationgroupform.component.html',
    directives: [ NgClass ],
    providers: [ ApplicationGroupService, MigrationProjectService ]
})
export class ApplicationGroupForm extends FormComponent implements OnInit
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

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _migrationProjectService: MigrationProjectService,
        private _applicationGroupService: ApplicationGroupService,
        private _formBuilder: FormBuilder
    ) {
        super();
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

    rerouteToGroupList() {
        this._router.navigate(['GroupList', {projectID: this.project.id}]);
    }

    cancel() {
        this.rerouteToGroupList();
    }
}