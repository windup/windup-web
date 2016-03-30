import {Inject, Injectable} from 'angular2/core';
import {Headers, Http, RequestOptions, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

import {RegisteredApplicationModel} from '../models/registered.application.model';
import {REST_BASE} from "../constants";

@Injectable()
export class FileService {
    private PATH_EXISTS_URL = "/file/pathExists";

    constructor (private _http: Http, @Inject(REST_BASE) private _restPath: string) {}

    pathExists(path:string) {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        return this._http.post(this._restPath + this.PATH_EXISTS_URL, path, options)
            .map(res => <boolean> res.json())
            .catch(this.handleError);
    }


    private handleError(error: Response) {
        console.error("Service error: " + error);
        return Observable.throw(error.json());
    }
}