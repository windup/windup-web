import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Constants} from "../constants";
import {AbstractService} from "../shared/abtract.service";
import {Observable} from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class FileService extends AbstractService {
    private PATH_EXISTS_URL = "/file/pathExists";

    constructor (private _http: HttpClient) {
        super();
    }

    pathExists(path: string): Observable<boolean> {
        return this._http.post<boolean>(Constants.REST_BASE + this.PATH_EXISTS_URL, path, this.JSON_OPTIONS);
    }

    queryServerPathTargetType(path: string): Observable<PathTargetType> {
        return this._http.post<PathTargetType>(Constants.REST_BASE + "/file/pathTargetType", path, this.JSON_OPTIONS);
    }
}

export type PathTargetType = "FILE" | "DIRECTORY" | null;
