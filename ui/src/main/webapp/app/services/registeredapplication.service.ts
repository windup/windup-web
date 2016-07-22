import {Inject, Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {RegisteredApplication} from "windup-services";

@Injectable()
export class RegisteredApplicationService {
    private GET_APPLICATIONS_URL = "/registeredApplications/list";
    private REGISTER_APPLICATION_URL = "/registeredApplications/register";

    constructor (private _http: Http, private _constants: Constants) {}

    registerApplication(application:RegisteredApplication) {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let body = JSON.stringify(application);

        return this._http.put(this._constants.REST_BASE + this.REGISTER_APPLICATION_URL, body, options)
            .map(res => <RegisteredApplication> res.json())
            .catch(this.handleError);
    }

    getApplications() {
        return this._http.get(this._constants.REST_BASE + this.GET_APPLICATIONS_URL)
            .map(res => <RegisteredApplication[]> res.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error("Service error: " + error);
        console.error("Service error (json): " + JSON.stringify(error.json()));
        return Observable.throw(error.json());
    }
}