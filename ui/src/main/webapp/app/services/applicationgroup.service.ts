import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';

import {Constants} from "../constants";
import {ApplicationGroup} from "windup-services";
import {AbstractService} from "./abtract.service";

@Injectable()
export class ApplicationGroupService extends AbstractService {
    private GET_ALL_URL = "/applicationGroups/list";
    private GET_BY_PROJECT_URL = "/applicationGroups/by-project/";
    private GET_BY_ID_URL = "/applicationGroups/get";
    private CREATE_URL = "/applicationGroups/create";
    private UPDATE_URL = "/applicationGroups/update";

    constructor (private _http: Http) {
        super();
    }

    create(applicationGroup: ApplicationGroup) {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let body = JSON.stringify(applicationGroup);

        return this._http.put(Constants.REST_BASE + this.CREATE_URL, body, options)
            .map(res => <ApplicationGroup> res.json())
            .catch(this.handleError);
    }

    update(applicationGroup: ApplicationGroup) {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let body = JSON.stringify(applicationGroup);

        return this._http.put(Constants.REST_BASE + this.UPDATE_URL, body, options)
            .map(res => <ApplicationGroup> res.json())
            .catch(this.handleError);
    }

    get(id:number) {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        return this._http.get(Constants.REST_BASE + this.GET_BY_ID_URL + "/" + id, options)
            .map(res => <ApplicationGroup> res.json())
            .catch(this.handleError);
    }

    getByProjectID(projectID:number) {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });

        return this._http.get(Constants.REST_BASE + this.GET_BY_PROJECT_URL + projectID, options)
            .map(res => <ApplicationGroup[]> res.json())
            .catch(this.handleError);
    }

    getAll() {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });

        return this._http.get(Constants.REST_BASE + this.GET_ALL_URL, options)
            .map(res => <ApplicationGroup[]> res.json())
            .catch(this.handleError);
    }
}