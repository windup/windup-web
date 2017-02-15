import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';

import {Constants} from "../constants";
import {MigrationProject} from "windup-services";
import {AbstractService} from "./abtract.service";
import {Observable} from "rxjs";

@Injectable()
export class MigrationProjectService extends AbstractService {
    private GET_MIGRATION_PROJECTS_URL = "/migrationProjects/list";
    private GET_MIGRATION_PROJECT_URL = "/migrationProjects/get";
    private CREATE_MIGRATION_PROJECT_URL = "/migrationProjects/create";
    private UPDATE_MIGRATION_PROJECT_URL = "/migrationProjects/update";
    private DELETE_MIGRATION_PROJECT_URL = '/migrationProjects/delete'


    constructor (private _http: Http) {
        super();
    }

    create(migrationProject: MigrationProject) {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let body = JSON.stringify(migrationProject);

        return this._http.put(Constants.REST_BASE + this.CREATE_MIGRATION_PROJECT_URL, body, options)
            .map(res => <MigrationProject> res.json())
            .catch(this.handleError);
    }

    update(migrationProject: MigrationProject) {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let body = JSON.stringify(migrationProject);

        return this._http.put(Constants.REST_BASE + this.UPDATE_MIGRATION_PROJECT_URL, body, options)
            .map(res => <MigrationProject> res.json())
            .catch(this.handleError);
    }

    delete(migrationProject: MigrationProject) {
        let body = JSON.stringify(migrationProject);

        let options = new RequestOptions({
            body: body,
            headers: new Headers()
        });

        options.headers.append('Content-Type', 'application/json');
        options.headers.append('Accept', 'application/json');

        return this._http.delete(Constants.REST_BASE + this.DELETE_MIGRATION_PROJECT_URL, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    get(id: number) {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });

        return this._http.get(Constants.REST_BASE + this.GET_MIGRATION_PROJECT_URL + "/" + id, options)
            .map(res => <MigrationProject> res.json())
            .catch(this.handleError);
    }


    getAll(): Observable<Array<MigrationProject & HasAppCount>> {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });

        return this._http.get(Constants.REST_BASE + this.GET_MIGRATION_PROJECTS_URL, options)
            .map(res => <MigrationProjectAndCount[]> res.json())
            // The consuming code still sees  MigrationProject, only with .appCount added.
            .map(entries => entries.map(entry => (entry.migrationProject["applicationCount"] = entry.applicationCount, entry.migrationProject)))
            .catch(this.handleError);
    }
}

export interface HasAppCount{ applicationCount: number; }
type MigrationProjectAndCount = { migrationProject: MigrationProject } & HasAppCount;
