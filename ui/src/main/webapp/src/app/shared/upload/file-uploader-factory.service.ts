import {Injectable} from "@angular/core";
import {FileUploaderWrapper} from "./file-uploader-wrapper.service";
import {FileUploaderOptions} from "ng2-file-upload";
import {KeycloakService} from "../../core/authentication/keycloak.service";

const defaultConfiguration: FileUploaderOptions= {
    disableMultipart: false
};

@Injectable()
export class FileUploaderFactory {
    public create(url: string, options: FileUploaderOptions = defaultConfiguration, _keycloakService:KeycloakService): FileUploaderWrapper {
        options.url = url;

        return new FileUploaderWrapper(options, _keycloakService);
    }
}
