import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {MigrationProject} from "../windup-services";
import {MigrationProjectService} from "../services/migration-project.service";
import {FormComponent} from "./form.component";

@Component({
    templateUrl: 'migration-project-form.component.html'
})
export class MigrationProjectFormComponent extends FormComponent implements OnInit
{
    model:MigrationProject = <MigrationProject>{};

    editMode:boolean = false;

    errorMessages: string[];

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _migrationProjectService: MigrationProjectService
    ) {
        super();
    }

    ngOnInit() {
        this._activatedRoute.data.subscribe((data: {project: MigrationProject}) => {
            if (data.project) {
                this.editMode = true;
                this.model = data.project;
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
