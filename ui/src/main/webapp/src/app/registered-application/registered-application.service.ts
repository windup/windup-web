import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {RegisteredApplication} from "windup-services";
import {AbstractService} from "../shared/abtract.service";
import {KeycloakService} from "../core/authentication/keycloak.service";
import {EventBusService} from "../core/events/event-bus.service";
import {
    ApplicationRegisteredEvent, ApplicationDeletedEvent
} from "../core/events/windup-event";
import {MigrationProject} from "windup-services";
import {PackageMetadata} from "windup-services";
import {SchedulerService} from "../shared/scheduler.service";
import {Subject} from "rxjs";

@Injectable()
export class RegisteredApplicationService extends AbstractService {
    public static PROJECT_APPLICATIONS = "/migrationProjects/{projectId}/registeredApplications";

    public static UPLOAD_URL = RegisteredApplicationService.PROJECT_APPLICATIONS + "/upload";
    public static UPLOAD_MULTIPLE_URL = RegisteredApplicationService.PROJECT_APPLICATIONS + "/upload-multiple";
    public static REGISTER_PATH_URL = RegisteredApplicationService.PROJECT_APPLICATIONS + "/register-path";
    public static REGISTER_DIRECTORY_PATH_URL = RegisteredApplicationService.PROJECT_APPLICATIONS + "/register-directory-path";

    public static SERVICE_SUBPATH = "/registeredApplications";

    public static GET_APPLICATIONS_URL        = RegisteredApplicationService.SERVICE_SUBPATH;
    public static BY_PROJECT_ID_URL           = RegisteredApplicationService.SERVICE_SUBPATH + "/by-project/{projectId}";
    public static SINGLE_APPLICATION_URL  = RegisteredApplicationService.SERVICE_SUBPATH + '/{appId}';
    public static UPDATE_APPLICATION_PATH_URL = RegisteredApplicationService.SINGLE_APPLICATION_URL + '/update-path';
    public static REUPLOAD_APPLICATION_URL    = RegisteredApplicationService.SINGLE_APPLICATION_URL + '/reupload';
    public static PACKAGES_URL    = RegisteredApplicationService.SINGLE_APPLICATION_URL + '/packages';

    protected static PACKAGE_REQUEST_PAUSE_TIME_MS = 10000;

    private UPLOAD_URL = '/file';

    constructor (
        private _http: Http,
        private _keycloakService:KeycloakService,
        private _multipartUploader: FileUploader,
        private _eventBusService: EventBusService,
        private _schedulerService: SchedulerService
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
        let body = path;
        let url = endpoint.replace("{projectId}", project.id.toString());

        return this._http.post(url, body, this.JSON_OPTIONS)
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
            .flatMap((token: string, index: number) =>
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
    }

    getMultipartUploader() {
        return this._multipartUploader;
    };

    getApplications(): Observable<RegisteredApplication[]> {
        return this._http.get(Constants.REST_BASE + RegisteredApplicationService.GET_APPLICATIONS_URL)
            .map(res => <RegisteredApplication[]> res.json())
            .catch(this.handleError);
    }

    getApplicationsByProjectID(id: number): Observable<RegisteredApplication[]> {
        return this._http.get(Constants.REST_BASE + RegisteredApplicationService.BY_PROJECT_ID_URL.replace("{projectId}", id.toString()))
            .map(res => <RegisteredApplication[]> res.json())
            .catch(this.handleError);
    }

    get(id: number): Observable<RegisteredApplication> {
        let url = Constants.REST_BASE + RegisteredApplicationService.SINGLE_APPLICATION_URL.replace('{appId}', id.toString());

        return this._http.get(url)
            .map(response => response.json())
            .catch(this.handleError);
    }

    updateByPath(application: RegisteredApplication): Observable<RegisteredApplication> {
        RegisteredApplicationService.deriveTitle(application);

        let body = JSON.stringify(application);

        let url = Constants.REST_BASE + RegisteredApplicationService.UPDATE_APPLICATION_PATH_URL.replace('{appId}', application.id.toString());

        return this._http.put(url, body, this.JSON_OPTIONS)
            .map(res => <RegisteredApplication> res.json())
            .catch(this.handleError);
    }

    updateByUpload(application: RegisteredApplication) {
        return this._keycloakService
            .getToken()
            .flatMap((token: string, index: number) => {
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

    deleteApplication(project: MigrationProject, application: RegisteredApplication): Observable<void> {
        let url = Constants.REST_BASE + RegisteredApplicationService.SINGLE_APPLICATION_URL.replace('{appId}', application.id.toString());
        return this._http.delete(url)
            .do(_ => {
                this._eventBusService.fireEvent(new ApplicationDeletedEvent(project, application, this));
            })
            .catch(this.handleError);
    }

    getPackageMetadata(application: RegisteredApplication): Observable<PackageMetadata> {
        let url = Constants.REST_BASE + RegisteredApplicationService.PACKAGES_URL.replace("{appId}", application.id.toString());

        return this._http.get(url)
            .catch(error => this.handleError(error))
            .map(res => res.json());
    }

    waitUntilPackagesAreResolved(application: RegisteredApplication): Observable<PackageMetadata> {
        let subject = new Subject<PackageMetadata>();

        let closure = () => {
            console.log('Closure called');

            this.getPackageMetadata(application).subscribe(packageMetadata => {
                console.log('Subscriber of getPackageMetadata called');
                if (packageMetadata.scanStatus !== "COMPLETE") {
                    // schedule another round
                    this._schedulerService.setTimeout(closure, RegisteredApplicationService.PACKAGE_REQUEST_PAUSE_TIME_MS);
                } else {
                    subject.next(packageMetadata);
                    subject.complete();
                }
            });
        };

        closure();

        return subject.asObservable();
    }
}
