import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {RegisteredApplication} from "../windup-services";
import {AbstractService} from "./abtract.service";
import {KeycloakService} from "./keycloak.service";

@Injectable()
export class RegisteredApplicationService extends AbstractService {
    public static REGISTERED_APPLICATION_SERVICE_NAME = "/registeredApplications/";
    public static REGISTER_APPLICATION_URL = "/registeredApplications/appGroup/";

    private GET_APPLICATIONS_URL        = "/registeredApplications/list";
    private UNREGISTER_URL              = "/registeredApplications/unregister";
    private UPDATE_APPLICATION_URL      = "/registeredApplications/update-application";
    private REGISTERED_APPLICATIONS_URL = '/registeredApplications';
    private REGISTER_PATH_URL           = "/registeredApplications/register-path/";
    private REGISTER_DIRECTORY_URL      = '/registeredApplications/register-directory-path';

    private UPLOAD_URL = '/file';

    constructor (private _http: Http, private _keycloakService:KeycloakService, private _multipartUploader: FileUploader) {
        super();
        this._multipartUploader.setOptions({
            url: Constants.REST_BASE + this.UPLOAD_URL + '/multipart',
            disableMultipart: false
        });
    }

    private updateTitle(application:RegisteredApplication) {
        let path = application.inputPath;

        // remove trailing slash if present
        if (path.endsWith("/") || path.endsWith("\\"))
        {
            path = path.substring(0, path.length-1);
        }

        if (path.lastIndexOf("/") != -1) {
            application.title = path.substring(path.lastIndexOf("/") + 1);
        } else if (path.lastIndexOf("\\") != -1) {
            application.title = path.substring(path.lastIndexOf("\\") + 1);
        }

        application.inputPath = path;
    }

    registerByPath(applicationGroupId:number, path:string):Observable<RegisteredApplication> {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let application = <RegisteredApplication>{};
        application.inputPath = path;

        this.updateTitle(application);

        let body = JSON.stringify(application);

        let url = Constants.REST_BASE + this.REGISTER_PATH_URL + applicationGroupId;
        return this._http.post(url, body, options)
            .map(res => <RegisteredApplication> res.json())
            .catch(this.handleError);
    }

    registerApplicationInDirectoryByPath(applicationGroupId: number, path: string): Observable<RegisteredApplication[]> {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let body = path;
        let url = Constants.REST_BASE + this.REGISTER_DIRECTORY_URL + "/" + applicationGroupId;

        return this._http.post(url, body, options)
            .map(res => <RegisteredApplication[]> res.json())
            .catch(this.handleError);
    }

    registerApplication(applicationGroupId: number) {
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

                return Observable.fromPromise(promise);
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
        let url = `${Constants.REST_BASE + this.REGISTERED_APPLICATIONS_URL}/${id}`;
        return this._http.get(url)
            .map(response => response.json())
            .catch(this.handleError);
    }

    update(application: RegisteredApplication) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers });

        this.updateTitle(application);

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

    unregister(application:RegisteredApplication) {
        let url = `${Constants.REST_BASE + this.UNREGISTER_URL}/${application.id}`;
        return this._http.delete(url)
            .catch(this.handleError);
    }

    deleteApplication(application: RegisteredApplication) {
        let url = `${Constants.REST_BASE + this.REGISTERED_APPLICATIONS_URL}/${application.id}`;
        return this._http.delete(url)
            .catch(this.handleError);
    }
}
