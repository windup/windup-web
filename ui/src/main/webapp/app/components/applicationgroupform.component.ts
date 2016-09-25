import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {ApplicationGroup, MigrationProject} from "windup-services";
import {ApplicationGroupService} from "../services/applicationgroup.service";
import {MigrationProjectService} from "../services/migrationproject.service";
import {FormComponent} from "./formcomponent.component";

@Component({
    selector: 'create-group-form',
    templateUrl: './applicationgroupform.component.html',
})
export class ApplicationGroupForm extends FormComponent implements OnInit
{
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
        private _activatedRoute: ActivatedRoute,
        private _migrationProjectService: MigrationProjectService,
        private _applicationGroupService: ApplicationGroupService
    ) {
        super();
    }

    ngOnInit() {
        this._activatedRoute.params.subscribe(params => {
            let projectID = parseInt(params["projectID"]);
            if (!isNaN(projectID)) {
                this.loadingProject = true;
                this._migrationProjectService.get(projectID).subscribe(
                    model => { this.project = model; this.loadingProject = false },
                    error => this.handleError(<any> error)
                );
            }

            let groupID = parseInt(params["groupID"]);
            if (!isNaN(groupID)) {
                this.editMode = true;
                this.loadingGroup = true;
                this._applicationGroupService.get(groupID).subscribe(
                    model => {
                        this.model = model;
                        if (this.project == null)
                            this.project = this.model.migrationProject;
                        this.loadingGroup = false;
                    },
                    error => this.handleError(<any> error)
                );
            }
        });
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
        this._router.navigate(['/group-list', {projectID: this.project.id}]);
    }

    cancel() {
        this.rerouteToGroupList();
    }
}