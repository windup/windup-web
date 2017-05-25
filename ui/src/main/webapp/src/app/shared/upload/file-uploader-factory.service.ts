import {Injectable} from "@angular/core";
import {FileUploaderWrapper} from "./file-uploader-wrapper.service";
import {FileUploaderOptions} from "ng2-file-upload";

const defaultConfiguration: FileUploaderOptions= {
    disableMultipart: false
};

@Injectable()
export class FileUploaderFactory {
    public create(url: string, options: FileUploaderOptions = defaultConfiguration): FileUploaderWrapper {
        options.url = url;

        return new FileUploaderWrapper(options);
    }
}
