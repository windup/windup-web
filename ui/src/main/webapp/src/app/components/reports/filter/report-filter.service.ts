import {Http} from "@angular/http";
import {Constants} from "../../../constants";
import {AbstractService} from "../../../services/abtract.service";
import {Observable} from "rxjs";
import {ReportFilter, ApplicationGroup} from "windup-services";
import {Injectable} from "@angular/core";
import {Tag} from "windup-services";
import {Category} from "windup-services";

@Injectable()
export class ReportFilterService extends AbstractService {
    protected FILTER_URL = '/applicationGroups/{groupId}/filter';
    protected TAGS_URL = '/applicationGroups/{groupId}/filter/tags';
    protected CATEGORIES_URL = '/applicationGroups/{groupId}/filter/categories';

    public constructor(private _http: Http) {
        super();
    }

    getFilter(applicationGroup: ApplicationGroup): Observable<ReportFilter> {
        let url = Constants.REST_BASE + this.FILTER_URL.replace('{groupId}', applicationGroup.id.toString());

        return this._http.get(url)
            .map(res => res.json())
            .catch(this.handleError);
    }

    clearFilter(applicationGroup: ApplicationGroup): Observable<ReportFilter> {
        let url = Constants.REST_BASE + this.FILTER_URL.replace('{groupId}', applicationGroup.id.toString());

        return this._http.delete(url)
            .map(res => res.json())
            .catch(this.handleError);
    }

    updateFilter(applicationGroup: ApplicationGroup, filter: any): Observable<ReportFilter> {
        let url = Constants.REST_BASE + this.FILTER_URL.replace('{groupId}', applicationGroup.id.toString());

        return this._http.put(url, filter)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getTags(applicationGroup: ApplicationGroup): Observable<Tag[]> {
        let url = Constants.REST_BASE + this.TAGS_URL.replace('{groupId}', applicationGroup.id.toString());

        return this._http.get(url)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getCategories(applicationGroup: ApplicationGroup): Observable<Category[]> {
        let url = Constants.REST_BASE + this.CATEGORIES_URL.replace('{groupId}', applicationGroup.id.toString());

        return this._http.get(url)
            .map(res => res.json())
            .catch(this.handleError);
    }
}
