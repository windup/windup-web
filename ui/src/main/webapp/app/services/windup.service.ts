import {Inject, Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {RegisteredApplication} from "windup-services";
import {WindupExecution} from "windup-services";

@Injectable()
export class WindupService {
    private EXECUTE_GROUP_PATH = "/windup/executeGroup";
    private GET_STATUS_GROUP_PATH = "/windup/statusGroup/";

    constructor (private _http: Http, private _constants: Constants) {}

    public getStatusGroup(executionID:number):Observable<WindupExecution> {
        let url = this._constants.REST_BASE + this.GET_STATUS_GROUP_PATH + executionID;

        return this._http.get(url)
            .map(res => <WindupExecution> res.json())
            .catch(this.handleError);
    }

    public executeWindupGroup(groupID:number):Observable<WindupExecution> {
        var headers = new Headers();
        var options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        var body = JSON.stringify(groupID);

        return this._http.post(this._constants.REST_BASE + this.EXECUTE_GROUP_PATH, body, options)
            .map(res => <WindupExecution> res.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}