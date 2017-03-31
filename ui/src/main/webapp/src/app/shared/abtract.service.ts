import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Headers, RequestOptions} from '@angular/http';
import {ReportFilter} from "windup-services";

@Injectable()
export class AbstractService {

    public JSON_HEADERS: Headers;
    public JSON_OPTIONS: RequestOptions;

    constructor (){
        this.JSON_HEADERS = new Headers();

        this.JSON_HEADERS.append('Content-Type', 'application/json');
        this.JSON_HEADERS.append('Accept', 'application/json');
        this.JSON_OPTIONS = new RequestOptions({ headers: this.JSON_HEADERS });
    }

    protected handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error("Service error: (" + typeof error + ") " + error);
        let json;

        try {
            json = error.json();
            console.error("Error contents: " + json);
        }
        catch (ex) {
            console.error("Service error - can't JSON: " + (<SyntaxError>ex).message);
        }

        return Observable.throw(json);
    }

    protected serializeFilter(filter: ReportFilter) {
        if (filter && filter.selectedApplications.length > 0) {
            filter.enabled = true;
        }

       return JSON.stringify(filter);
    }
}
