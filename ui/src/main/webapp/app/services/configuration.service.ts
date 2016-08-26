import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {Configuration} from "windup-services";

@Injectable()
export class ConfigurationService
{
    private GET_URL = "/configuration";
    private SAVE_URL = "/configuration";

    constructor (private _http: Http, private _constants: Constants) {}

    save(configuration: Configuration):Observable<Configuration> {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let body = JSON.stringify(configuration);

        return this._http.put(this._constants.REST_BASE + this.SAVE_URL, body, options)
            .map(res => <Configuration> res.json())
            .catch(this.handleError);
    }

    get() {
        return this._http.get(this._constants.REST_BASE + this.GET_URL)
            .map(res => <Configuration> res.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error("Service error: (" + typeof error + ") " + error);
        if (typeof error === 'object')
            console.error(JSON.stringify(error));
        var json;
        try {
            json = error.json();
            console.error("Service error - JSON: " + JSON.stringify(json));
        }
        catch (ex) {
            console.error("Service error - can't JSON: " + (<SyntaxError>ex).message);
        }
        return Observable.throw(json);
    }
}