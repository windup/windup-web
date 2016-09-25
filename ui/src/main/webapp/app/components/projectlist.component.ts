import {Component, OnDestroy, OnInit} from "@angular/core";
import {Inject} from '@angular/core';
import {Router} from "@angular/router";

import {MigrationProjectService} from "../services/migrationproject.service";
import {MigrationProject} from "windup-services";

@Component({
    selector: 'application-list',
    templateUrl: './projectlist.component.html'
})
export class ProjectListComponent implements OnInit, OnDestroy {
    projects:MigrationProject[];

    errorMessage:string;
    private _refreshIntervalID:number;

    constructor(
        private _router: Router,
        private _migrationProjectService: MigrationProjectService
    ) {}

    ngOnInit():any {
        this.getMigrationProjects();
        this._refreshIntervalID = setInterval(() => this.getMigrationProjects(), 30000);
    }

    ngOnDestroy():any {
        if (this._refreshIntervalID)
            clearInterval(this._refreshIntervalID);
    }

    getMigrationProjects() {
        return this._migrationProjectService.getAll().subscribe(
            applications => this.projectsLoaded(applications),
            error => {
                if (error instanceof ProgressEvent)
                    this.errorMessage = "ERROR: Server disconnected";
                else
                    this.errorMessage = <any>error
            }
        );
    }

    projectsLoaded(projects:MigrationProject[]) {
        this.errorMessage = "";

        this.projects = projects;
    }

    createMigrationProject() {
        this._router.navigate(['/migration-project-form']);
    }

    editProject(project:MigrationProject, event:Event) {
        event.preventDefault();
        this._router.navigate(['/migration-project-form', { projectID: project.id }])
    }

    viewProject(project:MigrationProject, event:Event) {
        event.preventDefault();
        console.log(JSON.stringify(project));
        this._router.navigate(['/group-list', { projectID: project.id }]);
    }
}