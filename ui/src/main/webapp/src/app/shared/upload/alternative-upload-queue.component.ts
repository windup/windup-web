import {Component, Input, NgZone, OnInit} from "@angular/core";
import {FileItem} from "ng2-file-upload";
import {utils} from "../utils";
import {NotificationService, NotificationType} from 'patternfly-ng/notification';
import {FileUploaderWrapper} from "./file-uploader-wrapper.service";
import {AbstractComponent} from "../AbstractComponent";
import {RegisteredApplicationService} from "../../registered-application/registered-application.service";

@Component({
    selector: 'wu-alternative-upload-queue',
    templateUrl: './alternative-upload-queue.component.html',
    styleUrls: ['./alternative-upload-queue.component.scss']
})
export class AlternativeUploadQueueComponent extends AbstractComponent implements OnInit {
    @Input()
    uploader: FileUploaderWrapper;

    progress = {};

    protected uploadErrors: Map<FileItem, string> = new Map<FileItem, string>();

    public constructor(private _ngZone: NgZone, private notificationService: NotificationService) {
        super();
    }

    ngOnInit(): void {
        this.subscriptions.push(this.uploader.observables.onProgressItem.subscribe(itemProgress => {            
            const item = itemProgress.item;
            const progress = itemProgress.progress;
            this._ngZone.run(() => this.progress[item.file.name] = progress);
        }));

        this.subscriptions.push(this.uploader.observables.onErrorItem.subscribe(itemError => {
            let response = utils.parseServerResponse(itemError.response);

            const item = itemError.item;

            if (this.isFileExistsError(response)) {
                this.uploadErrors.set(item, utils.getErrorMessage(response));
            }
            
            let errorMessage = response.message ? response.message : "Error uploading file";
            this.notificationService.message(NotificationType.DANGER, "Error", errorMessage, false, null, null);
            item.remove();
        }));

        /**
         * Code below is workaround for removeAfterUpload: true
         *
         * There is bug (or a feature?) in ng-file-upload, that it removes all items from queue
         *  when item is successfully uploaded or an error occurs.
         *  We need to remove it only for success.
         */
        let removeAfterUploaded = true;

        this.subscriptions.push(this.uploader.observables.onCompleteItem.subscribe(result => {
            const item = result.item;

            if (item.isSuccess && removeAfterUploaded) {
                item.remove();
            }
        }));
    }

    protected isFileExistsError(response: any) {
        return response['code'] && response['code'] === RegisteredApplicationService.ERROR_FILE_EXISTS;
    }

    public getProgress(item: FileItem) {
        if (!this.progress.hasOwnProperty(item.file.name)) {
            this.progress[item.file.name] = 0;
        }

        return this.progress[item.file.name];
    }

    /**
     * Gets progressbar width in %
     *
     * @param item {FileItem}
     * @returns {number} progress %
     */
    public getProgressbarWidth(item: FileItem): number {
        if (item.isCancel || item.isError) {
            return 100;
        }

        return item.progress;
    }

    /**
     * Gets progress label
     *
     * Progress %
     * or Cancelled when upload was cancelled
     * or Error when error occured
     *
     * @param item {FileItem}
     * @returns {string}
     */
    public getProgressLabel(item: FileItem): string {
        if (item.isCancel) {
            return 'Cancelled';
        } else if (item.isError) {
            return 'Error: ' + this.getUploadItemError(item);
        } else {
            return item.progress.toString() + '%';
        }
    }

    /**
     *
     * Gets upload status icon
     *
     * @param item {FileItem}
     * @returns {string}
     */
    public getStatusIcon(item: FileItem): string {
        if (item.isSuccess) {
            return 'glyphicon-ok';
        } else if (item.isCancel || item.isError) {
            return 'glyphicon-ban-circle';
        } else if (this.isCancellable(item)) {
            return 'glyphicon-remove';
        }
    }

    /**
     *
     *
     * @param item
     * @returns {boolean}
     */
    public isCancellable(item: FileItem): boolean {
        return !item.isUploaded && !item.isCancel && !item.isError;
    }

    public cancelUpload(item: FileItem) {
        if (item.isUploading) {
            item.cancel();
        } else {
            item.remove();
        }
    }

    public getUploadItemError(item: FileItem): string {
        return this.uploadErrors.get(item) || '';
    }
}
