import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Constants} from "../constants";
import {AbstractService} from "../shared/abtract.service";
import {Observable} from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class FileService extends AbstractService {
    private PATH_EXISTS_URL = "/file/pathExists";

    constructor (private _http: Http) {
        super();
    }

    pathExists(path: string): Observable<boolean> {
        return this._http.post(Constants.REST_BASE + this.PATH_EXISTS_URL, path, this.JSON_OPTIONS)
            .pipe(
                map(res => <boolean> res.json()),
                catchError(this.handleError)
            );
    }

    queryServerPathTargetType(path: string): Observable<PathTargetType> {
        return this._http.post(Constants.REST_BASE + "/file/pathTargetType", path, this.JSON_OPTIONS)
            .pipe(
                map(res => <PathTargetType> res.json()),
                catchError(this.handleError)
            );
    }
}

export type PathTargetType = "FILE" | "DIRECTORY" | null;
