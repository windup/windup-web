import {Component, Input, NgZone, OnInit} from "@angular/core";
import {FileUploader} from "ng2-file-upload/ng2-file-upload";
import {FileItem} from "ng2-file-upload";
import {utils} from "../utils";
import {NotificationService} from "../../core/notification/notification.service";
import {FileUploaderWrapper} from "./file-uploader-wrapper.service";

@Component({
    selector: 'wu-alternative-upload-queue',
    templateUrl: './alternative-upload-queue.component.html',
    styleUrls: ['./alternative-upload-queue.component.scss']
})
export class AlternativeUploadQueueComponent implements OnInit {
    @Input()
    uploader: FileUploaderWrapper;

    progress = {};

    protected uploadErrors: Map<FileItem, string> = new Map<FileItem, string>();

    public constructor(private _ngZone: NgZone, private _notificationService: NotificationService) {

    }

    ngOnInit(): void {
        this.uploader.onProgressItem = (item, progress) => {
            this._ngZone.run(() => this.progress[item.file.name] = progress);
        };

        this.uploader.onErrorItem = (item, response) => {
            if (typeof response === 'object' && response['rootCause'] && response['rootCause']['code'] === 1) {
                this.uploadErrors.set(item, utils.getErrorMessage(response));
            } else {
                this._notificationService.error(utils.getErrorMessage(response));
            }
        };

        /**
         * Code below is workaround for removeAfterUpload: true
         *
         * There is bug (or a feature?) in ng-file-upload, that it removes all items from queue
         *  when item is successfully uploaded or an error occurs.
         *  We need to remove it only for success.
         */
        let removeAfterUploaded = true;

        this.uploader.onCompleteItem = (item) => {
            if (item.isSuccess && removeAfterUploaded) {
                item.remove();
            }
        };

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

    public getUploadItemError(item: FileItem): string {
        return this.uploadErrors.get(item) || '';
    }
}
