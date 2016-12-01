import {Component, OnDestroy, OnInit, NgZone, ViewChild} from "@angular/core";
import {Router} from "@angular/router";

import {MigrationProjectService} from "../services/migration-project.service";
import {MigrationProject} from "../windup-services";
import {NotificationService} from "../services/notification.service";
import {utils} from "../utils";
import {ConfirmationModalComponent} from "./confirmation-modal.component";

@Component({
    selector: 'application-list',
    templateUrl: 'project-list.component.html',
    styles: [
        `a { cursor: pointer; }`
    ]
})
export class ProjectListComponent implements OnInit, OnDestroy {
    projects:MigrationProject[];

    @ViewChild('deleteProjectModal')
    readonly deleteProjectModal: ConfirmationModalComponent;

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

    editProject(project: MigrationProject) {
        event.preventDefault();
        this._router.navigate([`/projects/${project.id}/edit`]);
    }

    viewProject(project:MigrationProject) {
        event.preventDefault();
        console.log(JSON.stringify(project));
        this._router.navigate(['/projects', project.id]);
    }

    doDeleteProject(project: MigrationProject) {
        this._migrationProjectService.delete(project).subscribe(
            success => {
                this._notificationService.success(`Migration project '${project.title}' was successfully deleted`);
                let index = this.projects.indexOf(project);
                this.projects.splice(index, 1);
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
            }
        );
    }

    deleteProject(project: MigrationProject) {
        this.deleteProjectModal.data = project;
        this.deleteProjectModal.body = `Do you really want to delete project ${project.title}?`;

        // TODO: Use modal dialog component for confirmation
        //        this.deleteProjectModal.show();
        //        this.deleteProjectModal.confirmed.subscribe(project => this.doDeleteProject(project));

        if (window.confirm(this.deleteProjectModal.body)) {
            this.doDeleteProject(project);
        }
    }
}
