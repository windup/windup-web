import {Component, Input, OnInit, NgZone} from "@angular/core";
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';

@Component({
    selector: 'app-upload-queue',
    templateUrl: 'upload-queue.component.html'
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

    public getProgress(item) {
        if (!this.progress.hasOwnProperty(item.file.name)) {
            this.progress[item.file.name] = 0;
        }

        return this.progress[item.file.name];
    }
}
