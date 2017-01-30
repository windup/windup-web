import {Component, Input} from "@angular/core";
import {FileUploader} from "ng2-file-upload/ng2-file-upload";

@Component({
    selector: 'wu-upload-progressbar',
    templateUrl: 'upload-progressbar.component.html'
})
export class UploadProgressbarComponent {
    @Input()
    uploader: FileUploader;
}
