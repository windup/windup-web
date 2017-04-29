import {Component, Input, NgZone} from "@angular/core";
import {FileUploader} from "ng2-file-upload/ng2-file-upload";
import {FileItem} from "ng2-file-upload";

@Component({
    selector: 'wu-alternative-upload-queue',
    templateUrl: './alternative-upload-queue.component.html',
    styleUrls: ['./alternative-upload-queue.component.scss']
})
export class AlternativeUploadQueueComponent {
    @Input()
    uploader: FileUploader;

    progress = {};

    public constructor(private _ngZone: NgZone) {

    }

    ngOnInit(): void {
        this.uploader.onProgressItem = (item, progress) => {
            this._ngZone.run(() => this.progress[item.file.name] = progress);
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
            return 'Error';
        }
        else {
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
}
