import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {KeycloakService} from "./keycloak.service";

@Injectable()
export class AbstractService {
    protected handleError(error:Response) {
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