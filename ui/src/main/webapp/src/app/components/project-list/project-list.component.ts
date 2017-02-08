import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";

import {MigrationProjectService} from "../../services/migration-project.service";
import {MigrationProject} from "windup-services";
import {NotificationService} from "../../services/notification.service";
import {utils} from "../../utils";
import {ConfirmationModalComponent} from "../confirmation-modal.component";
import {SortingService, OrderDirection} from "../../services/sorting.service";

@Component({
    templateUrl: 'project-list.component.html',
    styleUrls: [
        './project-list.component.scss',
    ],
    providers: [
        SortingService
    ]
})
export class ProjectListComponent implements OnInit, OnDestroy {
    private _originalProjects: MigrationProject[] = [];

    public projects: MigrationProject[] = [];

    @ViewChild('deleteProjectModal')
    readonly deleteProjectModal: ConfirmationModalComponent;

    searchValue: string = '';

    private _refreshIntervalID;

    sort = {
        sortOptions: [
            { name: 'Name', field: 'title' },
            { name: 'Created date', field: 'created' },
            { name: 'Last modified date', field: 'lastModified' }
        ],
        selectedOption: { name: 'Name', field: 'title' },
        direction: OrderDirection.ASC
    };

    constructor(
        private _router: Router,
        private _migrationProjectService: MigrationProjectService,
        private _notificationService: NotificationService,
        private _sortingService: SortingService<MigrationProject>
    ) {}

    ngOnInit():any {
        this.updateSort();
        this.getMigrationProjects();
        this._refreshIntervalID = setInterval(() => this.getMigrationProjects(), 30000);
    }

    ngOnDestroy():any {
        if (this._refreshIntervalID)
            clearInterval(this._refreshIntervalID);
    }

    getMigrationProjects() {
        return this._migrationProjectService.getAll().subscribe(
            projects => this.projectsLoaded(projects),
            error => this._notificationService.error(utils.getErrorMessage(error))
        );
    }

    projectsLoaded(projects:MigrationProject[]) {
        this._originalProjects = projects;
        this.updateProjects();
    }

    createMigrationProject() {
        this._router.navigate(['/projects/create']);
    }

    editProject(event: Event, project: MigrationProject) {
        event.stopPropagation();

        this._router.navigate([`/projects/${project.id}/edit`]);
        return false;
    }

    viewProject(event: Event, project:MigrationProject) {
        event.stopPropagation();

        console.log(JSON.stringify(project));
        this._router.navigate(['/projects', project.id]);
        return false;
    }

    updateSort() {
        this._sortingService.orderBy(this.sort.selectedOption.field, this.sort.direction);
        this.updateProjects();
    }

    updateSearch(value: string) {
        this.searchValue = value;
        this.updateProjects();
    }

    updateProjects() {
        this.projects = this._sortingService.sort(this.filterProjects());
    }

    filterProjects(): MigrationProject[] {
        if (this.searchValue && this.searchValue.length > 0) {
            return this._originalProjects.filter(project => project.title.search(new RegExp(this.searchValue, 'i')) !== -1);
        }

        return this._originalProjects;
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

    deleteProject(event: Event, project: MigrationProject) {
        event.stopPropagation();

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
