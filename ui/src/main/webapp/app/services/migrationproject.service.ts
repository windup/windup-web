import {Inject, Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {MigrationProjectModel} from '../models/MigrationProject.model';
import {Constants} from "../constants";

@Injectable()
export class MigrationProjectService
{
    private GET_MIGRATION_PROJECTS_URL = "/migrationProjects/list";
    private CREATE_MIGRATION_PROJECT_URL = "/migrationProjects/create";

    constructor (private _http: Http, private _constants: Constants) {}

    createMigrationProject(migrationProject: MigrationProjectModel) {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let body = JSON.stringify(migrationProject);

        return this._http.put(this._constants.REST_BASE + this.CREATE_MIGRATION_PROJECT_URL, body, options)
            .map(res => <MigrationProjectModel> res.json())
            .catch(this.handleError);
    }

    getMigrationProjects() {
        return this._http.get(this._constants.REST_BASE + this.GET_MIGRATION_PROJECTS_URL)
            .map(res => <MigrationProjectModel[]> res.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error("Service error: " + error);
        console.error("Service error (json): " + JSON.stringify(error.json()));
        return Observable.throw(error.json());
    }
}