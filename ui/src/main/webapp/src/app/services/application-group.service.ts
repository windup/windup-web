import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';

import {Constants} from "../constants";
import {ApplicationGroup, PackageMetadata} from "windup-services";
import {AbstractService} from "./abtract.service";
import {Observable, Subject} from "rxjs";

@Injectable()
export class ApplicationGroupService extends AbstractService {
    private applicationGroupLoadedSubject = new Subject<ApplicationGroup>();
    applicationGroupLoaded:Observable<ApplicationGroup> = this.applicationGroupLoadedSubject.asObservable();

    private GET_ALL_URL = "/applicationGroups/list";
    private GET_BY_PROJECT_URL = "/applicationGroups/by-project/";
    private GET_BY_ID_URL = "/applicationGroups/get";
    private PACKAGE_METADATA = "/applicationGroups/#{groupID}/packages";
    private CREATE_URL = "/applicationGroups/create";
    private UPDATE_URL = "/applicationGroups/update";
    private DELETE_URL = '/applicationGroups/delete';

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
            .do(group => this.applicationGroupLoadedSubject.next(group))
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
            .do(group => this.applicationGroupLoadedSubject.next(group))
            .catch(this.handleError);
    }

    delete(applicationGroup: ApplicationGroup) {
        let body = JSON.stringify(applicationGroup);

        let options = new RequestOptions({
            body: body,
            headers: new Headers()
        });

        options.headers.append('Content-Type', 'application/json');
        options.headers.append('Accept', 'application/json');

        return this._http.delete(Constants.REST_BASE + this.DELETE_URL, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    get(id:number): Observable<ApplicationGroup> {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        return this._http.get(Constants.REST_BASE + this.GET_BY_ID_URL + "/" + id, options)
            .map(res => <ApplicationGroup> res.json())
            .do(group => this.applicationGroupLoadedSubject.next(group))
            .catch(this.handleError);
    }

    getPackageMetadata(id:number): Observable<PackageMetadata> {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });

        let url = this.PACKAGE_METADATA.replace("#{groupID}", id.toString());

        return this._http.get(Constants.REST_BASE + url, options)
            .map(res => <ApplicationGroup> res.json())
            .catch(this.handleError);
    }

    getByProjectID(projectID: number) {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });

        return this._http.get(Constants.REST_BASE + this.GET_BY_PROJECT_URL + projectID, options)
            .map(res => <ApplicationGroup[]> res.json())
            .do(groups => groups.forEach(group => this.applicationGroupLoadedSubject.next(group)))
            .catch(this.handleError);
    }

    getAll() {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });

        return this._http.get(Constants.REST_BASE + this.GET_ALL_URL, options)
            .map(res => <ApplicationGroup[]> res.json())
            .do(groups => groups.forEach(group => this.applicationGroupLoadedSubject.next(group)))
            .catch(this.handleError);
    }
}
