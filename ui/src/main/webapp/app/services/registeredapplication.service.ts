import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {RegisteredApplication} from "windup-services";
import {AbstractService} from "./abtract.service";
import {KeycloakService} from "./keycloak.service";

@Injectable()
export class RegisteredApplicationService extends AbstractService {
    private GET_APPLICATIONS_URL = "/registeredApplications/list";
    private REGISTER_APPLICATION_URL = "/registeredApplications/appgroup";
    private REGISTERED_APPLICATIONS_URL = '/registeredApplications';
    private UPLOAD_URL = '/file';
    private _uploader: FileUploader;
    private _multipartUploader: FileUploader;

    constructor (private _http: Http) {
        super();
        this._uploader = new FileUploader({
            url: Constants.REST_BASE + this.UPLOAD_URL,
            authToken: 'Bearer ' + KeycloakService.auth.authz.token,
            disableMultipart: true
        });

        this._multipartUploader = new FileUploader({
            url: Constants.REST_BASE + this.UPLOAD_URL + '/multipart',
            authToken: 'Bearer ' + KeycloakService.auth.authz.token,
            disableMultipart: false
        });
    }

    registerApplication(applicationGroupId: number) {
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

            this._multipartUploader.onErrorItem  = (item, response, status, headers) => {
                reject(JSON.parse(response));
            };
        });

        this._multipartUploader.uploadAll();

        return Observable.fromPromise(promise);
    }

    getUploader() {
        return this._uploader;
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

    deleteApplication(application: RegisteredApplication) {
        let url = `${Constants.REST_BASE + this.REGISTERED_APPLICATIONS_URL}/${application.id}`;
        return this._http.delete(url)
            .catch(this.handleError);
    }
}
