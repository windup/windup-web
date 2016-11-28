import {Component, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";

import {MigrationProjectService} from "../services/migration-project.service";
import {MigrationProject} from "../windup-services";
import {NotificationService} from "../services/notification.service";
import {utils} from "../utils";

@Component({
    selector: 'application-list',
    templateUrl: 'project-list.component.html'
})
export class ProjectListComponent implements OnInit, OnDestroy {
    projects:MigrationProject[];

    errorMessage:string;
    private _refreshIntervalID;

    constructor(
        private _router: Router,
        private _migrationProjectService: MigrationProjectService,
        private _notificationService: NotificationService
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
        this._router.navigate(['/projects/create']);
    }

    editProject(project: MigrationProject, event: Event) {
        event.preventDefault();
        this._router.navigate([`/projects/${project.id}/edit`]);
    }

    viewProject(project:MigrationProject, event:Event) {
        event.preventDefault();
        console.log(JSON.stringify(project));
        this._router.navigate(['/projects', project.id]);
    }

    deleteProject(project: MigrationProject) {
       this._migrationProjectService.delete(project).subscribe(
           success => {
                console.log(success);
           },
           error => {
               this._notificationService.error(utils.getErrorMessage(error));
           }
       );
    }
}
