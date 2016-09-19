import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';

import {Constants} from "../constants";
import {RegisteredApplication} from "windup-services";
import {AbstractService} from "./abtract.service";

@Injectable()
export class RegisteredApplicationService extends AbstractService {
    private GET_APPLICATIONS_URL = "/registeredApplications/list";
    private REGISTER_APPLICATION_URL = "/registeredApplications/register";

    constructor (private _http: Http) {
        super();
    }

    registerApplication(application:RegisteredApplication) {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let body = JSON.stringify(application);

        return this._http.put(Constants.REST_BASE + this.REGISTER_APPLICATION_URL, body, options)
            .map(res => <RegisteredApplication> res.json())
            .catch(this.handleError);
    }

    getApplications() {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        return this._http.get(Constants.REST_BASE + this.GET_APPLICATIONS_URL, options)
            .map(res => <RegisteredApplication[]> res.json())
            .catch(this.handleError);
    }
}
