import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";

@Injectable()
export class AbstractService {
    constructor(private _http:Http, private _constants:Constants) {
    }

    private handleError(error:Response) {
        console.error("Service error: " + error);
        return Observable.throw(error.json());
    }
}