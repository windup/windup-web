import {
    AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, ViewChild,  DoCheck, KeyValueDiffers
} from "@angular/core";
import {MigrationProject, RegisteredApplication} from "../generated/windup-services";
import {ConfirmationModalComponent} from "../shared/dialog/confirmation-modal.component";
import {FileItem} from "ng2-file-upload";
import {RegisteredApplicationService} from "./registered-application.service";
import {NotificationService} from "../core/notification/notification.service";
import {utils} from "../shared/utils";
import {DurationPipe} from "../shared/duration.pipe";

/**
 * This component is quite hacky way how to show the same visuals as in alternative-upload-queue.
 *
 *  There is nothing common between {RegisteredApplication} entity and {FileItem} used in upload queue,
 *   so no common component between these 2 could simply exist.
 *
 *  There are several possible (more or less hacky) ways how to solve that:
 *
 *   *1) Kind of duplicate what we have in upload queue in other component for existing applications list
 *       This is the approach I choose, since it felt like the simplest one.
 *   2) Have completely generic "parent" queue component with 2 childs - upload queue and existing applications list.
 *      This generic parent component wouldn't really be nice and it wouldn't be easy to modify it for both use cases.
 *   3) Kind of convert RegisteredApplication and FileItem entities into some common entity and have one component
 *      to handle it. This is not really nice, because for file upload we need more data which are not available
 *      in registered application.
 *   4) Have one component which would handle 2 things: RegisteredApplications and upload queue. Lot of code would be duplicated
 *     (or *ngIf would be heavily used there)
 *
 */
@Component({
    selector: 'wu-application-queue-list',
    templateUrl: './application-queue-list.component.html',
    styleUrls: [
        '../shared/upload/alternative-upload-queue.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationQueueListComponent implements AfterViewInit, DoCheck
{
    @Input()
    public registeredApplications: RegisteredApplication[] = [];

    @Input()
    public project: MigrationProject;

    @ViewChild('deleteAppDialog')
    readonly deleteAppDialog: ConfirmationModalComponent;

    differ: any;

    constructor(
        protected _registeredApplicationsService: RegisteredApplicationService,
        protected _notificationService: NotificationService,
        private differs: KeyValueDiffers
    ) {
        this.differ = differs.find({}).create(null);
    }

    ngDoCheck() {
        var changes = this.differ.diff(this.registeredApplications);

        if(changes) {
            changes.forEachAddedItem(r => {
                let analysisExpectedDuration = this.getAnalysisExpectedDuration((<RegisteredApplication>r.currentValue).fileSize);
                if (analysisExpectedDuration) {
                    this._notificationService.warning("Large application uploaded '" + (<RegisteredApplication>r.currentValue).inputFilename + "': analysis may take about " + analysisExpectedDuration);
                }
            });
        }
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

    public doDeleteApplication(application: RegisteredApplication) {
        this._registeredApplicationsService.deleteApplication(this.project, application).subscribe(
            //() => this._notificationService.success('Application was successfully deleted'),
            () => console.log(`Application ${application.id} was successfully deleted`),
            error => this._notificationService.error(utils.getErrorMessage(error))
        );
    }

    public confirmDeleteApplication(application: RegisteredApplication) {
        this.deleteAppDialog.data = application;
        this.deleteAppDialog.title = 'Confirm application deletion';
        this.deleteAppDialog.body = `Do you really want to delete application ${application.title}?`;

        this.deleteAppDialog.show();
    }

    private getAnalysisExpectedDuration(fileSize: number): String {
        let message: String;
        if (fileSize > 104857600) {
            // using a baseline of 1 hr per 200 MB
            // => 3600000 msec per 209715200 bytes
            // => 0.017 msec per 1 byte
            message = new DurationPipe().transform(fileSize * 0.017);
        }
        return message;
    }
}
