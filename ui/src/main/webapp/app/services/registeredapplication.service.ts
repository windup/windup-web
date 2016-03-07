import {Inject, Injectable} from 'angular2/core';
import {Headers, Http, RequestOptions, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

import {RegisteredApplicationModel} from '../models/registered.application.model';
import {REST_BASE} from "../constants";

@Injectable()
export class RegisteredApplicationService {
    private GET_APPLICATIONS_URL = "/registeredApplications/list";
    private REGISTER_APPLICATION_URL = "/registeredApplications/register";

    constructor (private _http: Http, @Inject(REST_BASE) private _restPath: string) {}

    registerApplication(path:string) {
        var headers = new Headers();
        var options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var body = "path=" + path;

        return this._http.post(this._restPath + this.REGISTER_APPLICATION_URL, body, options)
            .map(res => <RegisteredApplicationModel> res.json())
            .catch(this.handleError);
    }

    getApplications() {
        return this._http.get(this._restPath + this.GET_APPLICATIONS_URL)
            .map(res => <RegisteredApplicationModel[]> res.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}