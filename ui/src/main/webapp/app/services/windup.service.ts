import {Inject, Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

import {RegisteredApplicationModel} from '../models/registered.application.model';
import {REST_BASE} from "../constants";

@Injectable()
export class WindupService {
    private GET_APPLICATIONS_PATH = "/windup/listApplications";

    constructor (private _http: Http, @Inject(REST_BASE) private _restPath: string) {}

    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}