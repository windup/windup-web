import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {RegisteredApplication} from "windup-services";
import {AbstractService} from "./abtract.service";
import {KeycloakService} from "./keycloak.service";
import {EventBusService} from "./events/event-bus.service";
import {
    ApplicationRegisteredEvent, ApplicationDeletedEvent,
    ApplicationRemovedFromGroupEvent, ApplicationAssignedToGroupEvent
} from "./events/windup-event";
import {ApplicationGroup} from "windup-services";
import {MigrationProject} from "windup-services";
import {ApplicationGroupService} from "./application-group.service";

@Injectable()
export class RegisteredApplicationService extends AbstractService {
    public static PROJECT_APPLICATIONS = "/migrationProjects/{projectId}/registeredApplications";

    public static UPLOAD_URL = RegisteredApplicationService.PROJECT_APPLICATIONS + "/upload";
    public static UPLOAD_MULTIPLE_URL = RegisteredApplicationService.PROJECT_APPLICATIONS + "/upload-multiple";
    public static REGISTER_PATH_URL = RegisteredApplicationService.PROJECT_APPLICATIONS + "/register-path";
    public static REGISTER_DIRECTORY_PATH_URL = RegisteredApplicationService.PROJECT_APPLICATIONS + "/register-directory-path";

    public static REGISTERED_APPLICATION_SERVICE_NAME = "/registeredApplications";

    public static GET_APPLICATIONS_URL        = RegisteredApplicationService.REGISTERED_APPLICATION_SERVICE_NAME;
    public static SINGLE_APPLICATION_URL  = RegisteredApplicationService.REGISTERED_APPLICATION_SERVICE_NAME + '/{appId}';
    public static UPDATE_APPLICATION_PATH_URL = RegisteredApplicationService.SINGLE_APPLICATION_URL + '/update-path';
    public static REUPLOAD_APPLICATION_URL    = RegisteredApplicationService.SINGLE_APPLICATION_URL + '/reupload';

    private UPLOAD_URL = '/file';

    constructor (
        private _http: Http,
        private _keycloakService:KeycloakService,
        private _multipartUploader: FileUploader,
        private _applicationGroupService: ApplicationGroupService,
        private _eventBusService: EventBusService
    ) {
        super();
        this._multipartUploader.setOptions({
            url: Constants.REST_BASE + this.UPLOAD_URL + '/multipart',
            disableMultipart: false
        });
    }

    private static deriveTitle(application: RegisteredApplication) {
        let path = application.inputPath;

        // Remove trailing slash if present.
        if (path.endsWith("/") || path.endsWith("\\"))
            path = path.substring(0, path.length-1);
        application.inputPath = path;

        // Title = the last element of the path.
        path = path.substring(path.lastIndexOf("/") + 1);
        path = path.substring(path.lastIndexOf("\\") + 1);
        application.title = path;

    }

    private _doRegisterByPath<T>(endpoint: string, project: MigrationProject, path: string): Observable<T> {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let body = path;
        let url = endpoint.replace("{projectId}", project.id.toString());

        return this._http.post(url, body, options)
            .map(res => <RegisteredApplication> res.json())
            .catch(this.handleError)
            .do((responseApplication) => this.fireNewApplicationEvents(responseApplication, project));
    }

    registerByPath(project: MigrationProject, path: string): Observable<RegisteredApplication> {
        let endpoint = Constants.REST_BASE + RegisteredApplicationService.REGISTER_PATH_URL;

        return this._doRegisterByPath<RegisteredApplication>(endpoint, project, path);
    }

    registerApplicationInDirectoryByPath(project: MigrationProject, path: string): Observable<RegisteredApplication[]> {
        let endpoint = Constants.REST_BASE + RegisteredApplicationService.REGISTER_DIRECTORY_PATH_URL;

        return this._doRegisterByPath<RegisteredApplication[]>(endpoint, project, path);
    }

    uploadApplications(project: MigrationProject) {
        return this._keycloakService
            .getToken()
            .flatMap((token:string, index:number) =>
            {
                this._multipartUploader.setOptions({
                    authToken: 'Bearer ' + token,
                    method: 'POST'
                });

                let responses = [];
                let errors = [];

                let promise = new Promise((resolve, reject) => {
                    this._multipartUploader.onCompleteItem = (item, response, status, headers) => {
                        if (status == 200) {
                            responses.push(JSON.parse(response));
                        } else {
                            errors.push(JSON.parse(response));
                        }
                    };

                    this._multipartUploader.onCompleteAll = () => {
                        resolve(responses);
                    };

                    this._multipartUploader.onErrorItem = (item, response, status, headers) => {
                        reject(JSON.parse(response));
                    };
                });

                this._multipartUploader.uploadAll();

                return Observable.fromPromise(promise)
                    .do((responseApplications: RegisteredApplication[]) => this.fireNewApplicationEvents(responseApplications, project));
            });
    }

    protected fireNewApplicationEvents(applications: RegisteredApplication|RegisteredApplication[], project: MigrationProject) {
        this._eventBusService.fireEvent(new ApplicationRegisteredEvent(project, applications, this));

        // This is workaround until we change logic regarding to groups
        this._applicationGroupService.getByProjectID(project.id).subscribe(groups => {
            // If there is only 1 group, it is probably the default group
            // add new applications to this group automatically
            if (groups.length === 1) {
                groups.forEach(group => this._eventBusService.fireEvent(new ApplicationAssignedToGroupEvent(group, applications, this)));
            }
        });
    }

    getMultipartUploader() {
        return this._multipartUploader;
    };

    getApplications(): Observable<RegisteredApplication[]> {
        return this._http.get(Constants.REST_BASE + RegisteredApplicationService.GET_APPLICATIONS_URL)
            .map(res => <RegisteredApplication[]> res.json())
            .catch(this.handleError);
    }

    get(id: number): Observable<RegisteredApplication> {
        let url = Constants.REST_BASE + RegisteredApplicationService.SINGLE_APPLICATION_URL.replace('{appId}', id.toString());

        return this._http.get(url)
            .map(response => response.json())
            .catch(this.handleError);
    }

    updateByPath(application: RegisteredApplication) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers });

        RegisteredApplicationService.deriveTitle(application);

        let body = JSON.stringify(application);

        let url = Constants.REST_BASE + RegisteredApplicationService.UPDATE_APPLICATION_PATH_URL.replace('{appId}', application.id.toString());

        return this._http.put(url, body, options)
            .map(res => <RegisteredApplication> res.json())
            .catch(this.handleError);
    }

    updateByUpload(application: RegisteredApplication) {
        return this._keycloakService
            .getToken()
            .flatMap((token:string, index:number) => {
                this._multipartUploader.setOptions({
                    authToken: 'Bearer ' + token,
                    method: 'PUT'
                });

                let responses = [];
                let errors = [];

                let promise = new Promise((resolve, reject) => {
                    this._multipartUploader.onCompleteItem = (item, response, status, headers) => {
                        if (status == 200) {
                            responses.push(JSON.parse(response));
                        } else {
                            errors.push(JSON.parse(response));
                        }
                    };

                    this._multipartUploader.onCompleteAll = () => {
                        resolve(responses);
                    };

                    this._multipartUploader.onErrorItem = (item, response, status, headers) => {
                        reject(JSON.parse(response));
                    };
                });

                this._multipartUploader.uploadAll();

                return Observable.fromPromise(promise);
            });
    }

    deleteApplication(project: MigrationProject, application: RegisteredApplication) {
        let url = Constants.REST_BASE + RegisteredApplicationService.SINGLE_APPLICATION_URL.replace('{appId}', application.id.toString());
        return this._http.delete(url)
            .do(_ => {
                this._eventBusService.fireEvent(new ApplicationDeletedEvent(project, application, this));

                // This is workaround until we change logic regarding to groups
                this._applicationGroupService.getByProjectID(project.id).subscribe(appGroups => {
                    appGroups.forEach(group => this._eventBusService.fireEvent(new ApplicationRemovedFromGroupEvent(group, application, this)));
                });
            })
            .catch(this.handleError);
    }
}
