import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { Constants } from "../../constants";
import {AbstractService} from "../../services/abtract.service";

export class TagHierarchyData {
    tagName: string;
    color: string;
    title: string;
    root: boolean;
    pseudo: boolean;
    containedTags: TagHierarchyData[];
}

@Injectable()
export class TagDataService extends AbstractService {
    private cachedTagData:TagHierarchyData[];

    constructor(private _http:Http) {
        super();
    }

    getTagData():Observable<TagHierarchyData[]> {
        if (this.cachedTagData)
            return Observable.of(this.cachedTagData);

        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });

        return this._http.get(Constants.GRAPH_REST_BASE + "/tag-data", options)
            .map(res => <TagHierarchyData[]> res.json())
            .do(res => this.cachedTagData = res)
            .catch(this.handleError);
    }
}