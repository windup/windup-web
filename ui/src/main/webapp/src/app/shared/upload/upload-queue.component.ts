import {Component, Input, OnInit, NgZone} from "@angular/core";
import {FileUploader, FileItem} from 'ng2-file-upload/ng2-file-upload';

@Component({
    selector: 'wu-upload-queue',
    templateUrl: 'upload-queue.component.html',
    styles: [`
        .component-UploadQueue * { font-size: 12px; }
        table.component-UploadQueue { border: 1px solid gray; }
        table.component-UploadQueue th,
        table.component-UploadQueue td { border-bottom: 1px solid silver; }
    `]
})
export class UploadQueueComponent implements OnInit {
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
}
