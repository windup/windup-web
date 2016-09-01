import {NgClass} from "@angular/common";
import {Component, Input, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {MigrationProjectService} from "../services/migrationproject.service";
import {MigrationProject} from "windup-services";
import {FormComponent} from "./formcomponent.component";

@Component({
    selector: 'create-migration-project-form',
    templateUrl: 'app/components/migrationprojectform.component.html',
    directives: [ NgClass ]
})
export class MigrationProjectFormComponent extends FormComponent implements OnInit
{
    model:MigrationProject = <MigrationProject>{};

    editMode:boolean = false;
    loading:boolean = false;

    errorMessages: string[];

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _migrationProjectService: MigrationProjectService
    ) {
        super();
    }

    ngOnInit() {
        this._activatedRoute.params.subscribe(params => {
            let id:number = parseInt(params["projectID"]);
            if (!isNaN(id)) {
                this.editMode = true;
                this.loading = true;
                this._migrationProjectService.get(id).subscribe(
                    model => { this.model = model; this.loading = false },
                    error => this.handleError(<any> error)
                );
            }
        });
    }

    save() {
        if (this.editMode) {
            console.log("Updating migration project: " + this.model.title);
            this._migrationProjectService.update(this.model).subscribe(
                migrationProject => this.rerouteToProjectList(),
                error => this.handleError(<any> error)
            );
        } else {
            console.log("Creating migration project: " + this.model.title);
            this._migrationProjectService.create(this.model).subscribe(
                migrationProject => this.rerouteToProjectList(),
                error => this.handleError(<any> error)
            );
        }
    }

    rerouteToProjectList() {
        this._router.navigate(['/project-list']);
    }

    cancel() {
        this.rerouteToProjectList();
    }
}