import {Inject, Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {AnalysisContext} from "windup-services";

@Injectable()
export class AnalysisContextService
{
    private GET_URL = "/analysis-context/get";
    private CREATE_URL = "/analysis-context/create";
    private UPDATE_URL = "/analysis-context/update";

    constructor (private _http: Http, private _constants: Constants) {}

    create(analysisContext: AnalysisContext) {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let body = JSON.stringify(analysisContext);

        return this._http.put(this._constants.REST_BASE + this.CREATE_URL, body, options)
            .map(res => <AnalysisContext> res.json())
            .catch(this.handleError);
    }

    update(analysisContext: AnalysisContext) {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let body = JSON.stringify(analysisContext);

        return this._http.put(this._constants.REST_BASE + this.UPDATE_URL, body, options)
            .map(res => <AnalysisContext> res.json())
            .catch(this.handleError);
    }

    get(id:number) {
        return this._http.get(this._constants.REST_BASE + this.GET_URL + "/" + id)
            .map(res => <AnalysisContext> res.json())
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