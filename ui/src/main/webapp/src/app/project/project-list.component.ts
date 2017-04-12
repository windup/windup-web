import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";

import {MigrationProjectService, HasAppCount} from "./migration-project.service";
import {MigrationProject} from "windup-services";
import {NotificationService} from "../core/notification/notification.service";
import {utils} from "../shared/utils";
import {ConfirmationModalComponent} from "../shared/confirmation-modal.component";
import {SortingService, OrderDirection} from "../shared/sort/sorting.service";

@Component({
    templateUrl: './project-list.component.html',
    styleUrls: [
        './project-list.component.scss',
    ],
    providers: [
        SortingService
    ]
})
export class ProjectListComponent implements OnInit {
    private _originalProjects: MigrationProject[] = [];

    loading: boolean = true;
    get totalProjectCount():number {
        if (this._originalProjects == null)
            return 0;

        return this._originalProjects.length;
    }

    projects: MigrationProject[] = [];

    @ViewChild('deleteProjectModal')
    readonly deleteProjectModal: ConfirmationModalComponent;

    searchValue: string = '';

    sort = {
        sortOptions: [
            { name: 'Name', field: 'title' },
            { name: 'Created date', field: 'created' },
            { name: 'Last modified date', field: 'lastModified' },
            { name: 'Number of applications', field: (proj:MigrationProject) => proj.applications ? proj.applications.length : 0 },
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
    }

    getMigrationProjects() {
        return this._migrationProjectService.getAll().subscribe(
            projects => this.projectsLoaded(projects),
            error => this._notificationService.error(utils.getErrorMessage(error))
        );
    }

    projectsLoaded(projects:MigrationProject[]) {
        this.loading = false;
        this._originalProjects = projects;
        this.updateProjects();
    }

    createMigrationProject() {
        this._router.navigate(['/wizard/create-project']);
    }

    editProject(event: Event, project: MigrationProject) {
        event.stopPropagation();

        this._router.navigate([`/projects/${project.id}/edit`]);
        return false;
    }

    viewProject(event: Event, project:MigrationProject) {
        event.stopPropagation();

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
                let index = this._originalProjects.indexOf(project);
                this._originalProjects.splice(index, 1);
                this.updateProjects();
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
