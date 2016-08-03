import {Component, OnDestroy, OnInit} from "@angular/core";
import {Inject} from '@angular/core';
import {Router} from "@angular/router-deprecated";

import {MigrationProjectService} from "../services/migrationproject.service";
import {MigrationProject} from "windup-services";

@Component({
    selector: 'application-list',
    templateUrl: 'app/components/projectlist.component.html',
    providers: [ MigrationProjectService ]
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
        this._refreshIntervalID = setInterval(() => this.getMigrationProjects(), 3000);
    }

    ngOnDestroy():any {
        if (this._refreshIntervalID)
            clearInterval(this._refreshIntervalID);
    }

    getMigrationProjects() {
        return this._migrationProjectService.getMigrationProjects().subscribe(
            applications => this.projectsLoaded(applications),
            error => this.errorMessage = <any>error
        );
    }

    projectsLoaded(projects:MigrationProject[]) {
        this.errorMessage = "";

        this.projects = projects;
    }

    createMigrationProject() {
        this._router.navigate(['MigrationProjectForm']);
    }

    editProject(project:MigrationProject, event:Event) {
        event.preventDefault();
        this._router.navigate(['MigrationProjectForm', { projectID: project.id }])
    }

    viewProject(project:MigrationProject, event:Event) {
        event.preventDefault();
        console.log(JSON.stringify(project));
        this._router.navigate(['GroupList', { projectID: project.id }]);
    }
}