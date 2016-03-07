import {Inject, Injectable} from 'angular2/core';
import {Headers, Http, RequestOptions, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

import {RegisteredApplicationModel} from '../models/registered.application.model';
import {REST_BASE} from "../constants";
import {ProgressStatusModel} from "../models/progressstatus.model";

@Injectable()
export class WindupService {
    private GET_STATUS_PATH = "/windup/status";
    private EXECUTE_PATH = "/windup/execute";

    constructor (private _http: Http, @Inject(REST_BASE) private _restPath: string) {}

    public getStatus(path:string) {
        var headers = new Headers();
        var options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var body = "path=" + path;

        return this._http.post(this._restPath + this.GET_STATUS_PATH, body, options)
            .map(res => <ProgressStatusModel> res.json())
            .catch(this.handleError);
    }

    public executeWindup(path:string) {
        var headers = new Headers();
        var options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var body = "inputPath=" + path + "&outputPath=" + "/home/jsightler/tmp/webreport";

        return this._http.post(this._restPath + this.EXECUTE_PATH, body, options)
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}