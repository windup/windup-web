import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {MigrationProject, RegisteredApplication} from "../generated/windup-services";
import {RegisteredApplicationService} from "./registered-application.service";
import {NotificationService} from "../core/notification/notification.service";
import {utils} from "../shared/utils";
import {WindupExecutionService} from "../services/windup-execution.service";
import {EventBusService} from "../core/events/event-bus.service";
import {
    ExecutionEvent, ApplicationDeletedEvent, UpdateMigrationProjectEvent,
    MigrationProjectEvent
} from "../core/events/windup-event";
import {ExecutionsMonitoringComponent} from "../executions/executions-monitoring.component";
import {ConfirmationModalComponent} from "../shared/dialog/confirmation-modal.component";
import {WindupService} from "../services/windup.service";

@Component({
    templateUrl: './application-list.component.html',
    styleUrls: [
        '../../../css/tables.scss',
        './application-list.component.scss'
    ]
})
export class ApplicationListComponent extends ExecutionsMonitoringComponent implements OnInit, OnDestroy, AfterViewInit
{
    public filteredApplications: RegisteredApplication[] = [];
    public sortedApplications: RegisteredApplication[] = [];
    public searchText: string;

    @ViewChild('deleteAppDialog')
    readonly deleteAppDialog: ConfirmationModalComponent;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _registeredApplicationsService: RegisteredApplicationService,
        private _notificationService: NotificationService,
        _windupExecutionService: WindupExecutionService,
        private _windupService: WindupService,
        private _eventBus: EventBusService
    ) {
        super(_windupExecutionService);
    }

    ngOnInit(): any {
        this._eventBus.onEvent
            .filter(event => event.isTypeOf(ExecutionEvent))
            .filter((event: ExecutionEvent) => event.migrationProject.id === this.project.id)
            .subscribe((event: ExecutionEvent) => {
                this.onExecutionEvent(event);
            });

        this._eventBus.onEvent
            .filter(event => event.isTypeOf(ApplicationDeletedEvent))
            .subscribe((event: ApplicationDeletedEvent) => this.onApplicationDeleted(event));

        this._eventBus.onEvent
            .filter(event => event.isTypeOf(UpdateMigrationProjectEvent))
            .filter((event: UpdateMigrationProjectEvent) => event.migrationProject.id === this.project.id)
            .subscribe((event: UpdateMigrationProjectEvent) => this.reloadMigrationProject(event.migrationProject));

        this._activatedRoute.parent.parent.data.subscribe((data: {project: MigrationProject}) => {
            this.reloadMigrationProject(data.project);
            this._windupService.getProjectExecutions(this.project.id).subscribe(executions => {
                this.loadActiveExecutions(executions);
            });
        });
    }

    ngAfterViewInit(): any {
        this.deleteAppDialog.confirmed.subscribe((application) => {
            this.doDeleteApplication(application);
        });

        this.deleteAppDialog.cancelled.subscribe(() => {
            this.deleteAppDialog.data = null;
            this.deleteAppDialog.body = '';
            this.deleteAppDialog.title = '';
        });
    }

    reloadMigrationProject(project: MigrationProject) {
        this.project = project;
        this.filteredApplications = project.applications;
        this.sortedApplications = project.applications;
        this.updateSearch();
    }

    onApplicationDeleted(event: ApplicationDeletedEvent) {
        this.project.applications = this.project.applications.filter(app => {
           return !event.applications.includes(app);
        });
    }

    ngOnDestroy() {
    }

    registerApplication() {
        this._router.navigate([`/projects/${this.project.id}/applications/register`]);
    }

    editApplication(application: RegisteredApplication) {
        this._router.navigate([`/projects/${this.project.id}/applications/${application.id}/edit`]);
    }

    public doDeleteApplication(application: RegisteredApplication) {
        this._registeredApplicationsService.deleteApplication(this.project, application).subscribe(
            () => this._notificationService.success(`The application ‘${application.title}’ was deleted.`),
            error => this._notificationService.error(utils.getErrorMessage(error))
        );
    }

    public confirmDeleteApplication(application: RegisteredApplication) {
        if (this.activeExecutions && this.activeExecutions.length > 0)
            return false;

        this.deleteAppDialog.data = application;
        this.deleteAppDialog.title = 'Confirm Application Deletion';
        this.deleteAppDialog.body = `Are you sure you want to delete “${application.title}”?`;

        this.deleteAppDialog.show();
    }

    updateSearch() {
        if (this.searchText && this.searchText.length > 0) {
            this.filteredApplications = this.project.applications.filter(app => app.title.search(new RegExp(this.searchText, 'i')) !== -1);
        } else {
            this.filteredApplications = this.project.applications;
        }
    }
}
