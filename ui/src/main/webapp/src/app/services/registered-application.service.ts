import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {RegisteredApplication} from "windup-services";
import {AbstractService} from "./abtract.service";
import {KeycloakService} from "./keycloak.service";
import {EventBusService} from "./events/event-bus.service";
import {ApplicationRegisteredEvent, ApplicationDeletedEvent} from "./events/windup-event";
import {ApplicationGroup} from "windup-services";

@Injectable()
export class RegisteredApplicationService extends AbstractService {
    public static REGISTERED_APPLICATION_SERVICE_NAME = "/registeredApplications/";
    public static REGISTER_APPLICATION_URL = "/registeredApplications/appGroup/";

    private GET_APPLICATIONS_URL        = "/registeredApplications/list";
    private UNREGISTER_URL              = "/registeredApplications/unregister";
    private UPDATE_APPLICATION_URL      = "/registeredApplications/update-application";
    private REGISTERED_APP_BY_ID_URL    = '/registeredApplications/id';
    private REGISTERED_APPLICATIONS_URL = '/registeredApplications';
    private REGISTER_PATH_URL           = "/registeredApplications/register-path/";
    private REGISTER_DIRECTORY_URL      = '/registeredApplications/register-directory-path';

    private UPLOAD_URL = '/file';

    constructor (
        private _http: Http,
        private _keycloakService:KeycloakService,
        private _multipartUploader: FileUploader,
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

    registerByPath(applicationGroup: ApplicationGroup, path:string):Observable<RegisteredApplication> {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let application = <RegisteredApplication>{};
        application.inputPath = path;

        RegisteredApplicationService.deriveTitle(application);

        let body = JSON.stringify(application);

        let url = Constants.REST_BASE + this.REGISTER_PATH_URL + applicationGroup.id;
        return this._http.post(url, body, options)
            .map(res => <RegisteredApplication> res.json())
            .do((responseApplication) => this._eventBusService.fireEvent(new ApplicationRegisteredEvent(applicationGroup, responseApplication, this)))
            .catch(this.handleError);
    }

    registerApplicationInDirectoryByPath(applicationGroup: ApplicationGroup, path: string): Observable<RegisteredApplication[]> {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let body = path;
        let url = Constants.REST_BASE + this.REGISTER_DIRECTORY_URL + "/" + applicationGroup.id;

        return this._http.post(url, body, options)
            .map(res => <RegisteredApplication[]> res.json())
            .do((responseApplications) => this._eventBusService.fireEvent(new ApplicationRegisteredEvent(applicationGroup, responseApplications, this)))
            .catch(this.handleError);
    }

    registerApplication(applicationGroup: ApplicationGroup) {
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
                    .do((responseApplications: RegisteredApplication[]) => this._eventBusService.fireEvent(new ApplicationRegisteredEvent(applicationGroup, responseApplications, this)));
            });
    }

    getMultipartUploader() {
        return this._multipartUploader;
    };

    getApplications() {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        return this._http.get(Constants.REST_BASE + this.GET_APPLICATIONS_URL, options)
            .map(res => <RegisteredApplication[]> res.json())
            .catch(this.handleError);
    }

    get(id: number): Observable<RegisteredApplication> {
        let url = `${Constants.REST_BASE + this.REGISTERED_APP_BY_ID_URL}/${id}`;
        return this._http.get(url)
            .map(response => response.json())
            .catch(this.handleError);
    }

    update(application: RegisteredApplication) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers });

        RegisteredApplicationService.deriveTitle(application);

        let body = JSON.stringify(application);

        let url = Constants.REST_BASE + this.UPDATE_APPLICATION_URL;
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

    unregister(group: ApplicationGroup, application: RegisteredApplication) {
        let url = `${Constants.REST_BASE + this.UNREGISTER_URL}/${application.id}`;
        return this._http.delete(url)
            .do(_ => this._eventBusService.fireEvent(new ApplicationDeletedEvent(group, application, this)))
            .catch(this.handleError)
    }

    deleteApplication(group: ApplicationGroup, application: RegisteredApplication) {
        let url = `${Constants.REST_BASE + this.REGISTERED_APPLICATIONS_URL}/${application.id}`;
        return this._http.delete(url)
            .do(_ => this._eventBusService.fireEvent(new ApplicationDeletedEvent(group, application, this)))
            .catch(this.handleError);
    }
}
