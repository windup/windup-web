import {Injectable, NgZone} from '@angular/core';
import {Http} from '@angular/http';
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {RegisteredApplication, MigrationProject, PackageMetadata} from "../generated/windup-services";
import {AbstractService} from "../shared/abtract.service";
import {KeycloakService} from "../core/authentication/keycloak.service";
import {EventBusService} from "../core/events/event-bus.service";
import {
    ApplicationRegisteredEvent, ApplicationDeletedEvent
} from "../core/events/windup-event";
import {SchedulerService} from "../shared/scheduler.service";
import {ReplaySubject} from "rxjs";
import {Cached} from "../shared/cache.service";
import {isArray} from "util";
import {utils} from "../shared/utils";

@Injectable()
export class RegisteredApplicationService extends AbstractService {
    public static PROJECT_APPLICATIONS = "/migrationProjects/{projectId}/registeredApplications";

    public static UPLOAD_URL = RegisteredApplicationService.PROJECT_APPLICATIONS + "/upload";
    public static UPLOAD_MULTIPLE_URL = RegisteredApplicationService.PROJECT_APPLICATIONS + "/upload-multiple";
    public static REGISTER_PATH_URL = RegisteredApplicationService.PROJECT_APPLICATIONS + "/register-path?exploded={exploded}";
    public static REGISTER_DIRECTORY_PATH_URL = RegisteredApplicationService.PROJECT_APPLICATIONS + "/register-directory-path";

    public static SERVICE_SUBPATH = "/registeredApplications";

    public static GET_APPLICATIONS_URL        = RegisteredApplicationService.SERVICE_SUBPATH;
    public static BY_PROJECT_ID_URL           = RegisteredApplicationService.SERVICE_SUBPATH + "/by-project/{projectId}";
    public static SINGLE_APPLICATION_URL  = RegisteredApplicationService.SERVICE_SUBPATH + '/{appId}';
    public static UPDATE_APPLICATION_PATH_URL = RegisteredApplicationService.SINGLE_APPLICATION_URL + '/update-path';
    public static REUPLOAD_APPLICATION_URL    = RegisteredApplicationService.SINGLE_APPLICATION_URL + '/reupload';
    public static PACKAGES_URL    = RegisteredApplicationService.SINGLE_APPLICATION_URL + '/packages';
    public static DOWNLOAD_URL = RegisteredApplicationService.SINGLE_APPLICATION_URL + '/download';

    protected static PACKAGE_REQUEST_PAUSE_TIME_MS = 2000;

    public static ERROR_FILE_EXISTS = 1;

    private UPLOAD_URL = '/file';

    constructor (
        private _http: Http,
        private _keycloakService:KeycloakService,
        private _multipartUploader: FileUploader,
        private _eventBusService: EventBusService,
        private _schedulerService: SchedulerService,
        private _ngZone: NgZone
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

    private _doRegisterByPath<T>(endpoint: string, project: MigrationProject, path: string, isDirWithExplodedApp: boolean): Observable<T> {
        let body = path;
        let url = endpoint.replace("{projectId}", project.id.toString()).replace("{exploded}", ""+!!isDirWithExplodedApp);

        return this._http.post(url, body, this.JSON_OPTIONS)
            .map(res => <RegisteredApplication> res.json())
            .catch(this.handleError)
            .do((responseApplication) => {
                let responseApplicationArray;

                if (isArray(responseApplication)) {
                    responseApplicationArray = responseApplication;
                } else {
                    responseApplicationArray = [ responseApplication ];
                }

                const newApplications = responseApplicationArray.filter(responseApp => {
                    return !project.applications || !project.applications.some(app => app.id === responseApp.id);
                });


                if (newApplications.length > 0) {
                    this.fireNewApplicationEvents(newApplications, project);
                }
            });
    }

    registerByPath(project: MigrationProject, path: string, isDirWithExplodedApp: boolean): Observable<RegisteredApplication> {
        let endpoint = Constants.REST_BASE + RegisteredApplicationService.REGISTER_PATH_URL;

        return this._doRegisterByPath<RegisteredApplication>(endpoint, project, path, isDirWithExplodedApp);
    }

    registerApplicationInDirectoryByPath(project: MigrationProject, path: string): Observable<RegisteredApplication[]> {
        let endpoint = Constants.REST_BASE + RegisteredApplicationService.REGISTER_DIRECTORY_PATH_URL;

        return this._doRegisterByPath<RegisteredApplication[]>(endpoint, project, path, false);
    }

    uploadApplications(project: MigrationProject): Observable<RegisteredApplication[]> {
        return this._keycloakService
            .getToken()
            .flatMap((token: string) =>
            {
                this._multipartUploader.setOptions({
                    authToken: 'Bearer ' + token,
                    method: 'POST'
                });

                let responses = [];
                let errors = [];

                let promise = new Promise((resolve, reject) => {
                    this._multipartUploader.onCompleteItem = (item, response, status, headers) => {
                        let responseMessage = utils.parseServerResponse(response);

                        if (status == 200) {
                            this.fireNewApplicationEvents(responseMessage, project);
                            responses.push(responseMessage);
                        } else {
                            errors.push(responseMessage);
                        }
                    };

                    this._multipartUploader.onCompleteAll = () => {
                        resolve(responses);
                    };

                    this._multipartUploader.onErrorItem = (item, response, status, headers) => {
                        let responseMessage = utils.parseServerResponse(response);
                        reject(utils.getErrorMessage(responseMessage));
                    };
                });

                this._multipartUploader.uploadAll();

                return Observable.fromPromise(promise);
            });
    }

    protected fireNewApplicationEvents(applications: RegisteredApplication|RegisteredApplication[], project: MigrationProject) {
        this._eventBusService.fireEvent(new ApplicationRegisteredEvent(project, applications, this));
    }

    getMultipartUploader() {
        return this._multipartUploader;
    };

    @Cached('application')
    getApplications(): Observable<RegisteredApplication[]> {
        return this._http.get(Constants.REST_BASE + RegisteredApplicationService.GET_APPLICATIONS_URL)
            .map(res => <RegisteredApplication[]> res.json())
            .catch(this.handleError);
    }

    @Cached('application')
    getApplicationsByProjectID(id: number): Observable<RegisteredApplication[]> {
        return this._http.get(Constants.REST_BASE + RegisteredApplicationService.BY_PROJECT_ID_URL.replace("{projectId}", id.toString()))
            .map(res => <RegisteredApplication[]> res.json())
            .catch(this.handleError);
    }

    @Cached('application')
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
                        const parsedResponse = utils.parseServerResponse(response);

                        if (status == 200) {
                            responses.push(parsedResponse);
                        } else {
                            errors.push(parsedResponse);
                        }
                    };

                    this._multipartUploader.onCompleteAll = () => {
                        resolve(responses);
                    };

                    this._multipartUploader.onErrorItem = (item, response, status, headers) => {
                        let responseMessage = utils.parseServerResponse(response);
                        reject(utils.getErrorMessage(responseMessage));
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

    /**
     * Checks if PackageMetadata scanStatus is complete.
     * If it is, PackageMetadata object can be treated as immutable and cached
     *
     * @param metadata {PackageMetadata}
     * @returns {boolean}
     */
    static arePackagesLoaded = (metadata: PackageMetadata) => {
        return metadata && metadata.scanStatus === "COMPLETE";
    };

    /**
     * Gets package metadata
     *
     * @param application {RegisteredApplication}
     * @returns {Observable<PackageMetadata>}
     */
    @Cached({section: 'application', immutable: true, cacheItemCallback: RegisteredApplicationService.arePackagesLoaded})
    getPackageMetadata(application: RegisteredApplication): Observable<PackageMetadata> {
        let url = Constants.REST_BASE + RegisteredApplicationService.PACKAGES_URL.replace("{appId}", application.id.toString());

        return this._http.get(url)
            .catch(error => this.handleError(error))
            .map(res => res.json());
    }

    waitUntilPackagesAreResolved(application: RegisteredApplication): Observable<PackageMetadata> {
        // ReplaySubject must be used because data might be cached and resolved right away
        let subject = new ReplaySubject<PackageMetadata>(1);

        let closure = () => {
            this.getPackageMetadata(application).subscribe(packageMetadata =>
                this._ngZone.run(() =>{
                    if (packageMetadata.scanStatus !== "COMPLETE") {
                        // schedule another round
                        this._schedulerService.setTimeout(closure, RegisteredApplicationService.PACKAGE_REQUEST_PAUSE_TIME_MS);
                    } else {
                        subject.next(packageMetadata);
                        subject.complete();
                    }
                })
            );
        };

        closure();

        return subject.asObservable();
    }

    public getDownloadUrl(app: RegisteredApplication): string {
        return Constants.REST_BASE + RegisteredApplicationService.DOWNLOAD_URL.replace('{appId}', app.id.toString());
    }
}
