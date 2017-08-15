import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import { AbstractService } from "../../shared/abtract.service";
import { Constants } from "../../constants";
import { FileModel } from "../../generated/tsModels/FileModel";
import { GraphJSONToModelService } from "./graph-json-to-model.service";
import { TechnologyTagModel } from "../../generated/tsModels/TechnologyTagModel";

@Injectable()
export class TechnologyTagService extends AbstractService {

    constructor(private _http: Http, private _graphJsonToModelService: GraphJSONToModelService<any>) {
        super();
    }

    getTagsForFile(executionId: number, fileModelID: number): Observable<TechnologyTagModel[]> {
        let url = `${Constants.GRAPH_REST_BASE}/graph/technology-tag/${executionId}/by-file/${fileModelID}`;
        let service = this._graphJsonToModelService;

        return this._http.get(url)
            .map(res => res.json())
            .map(res => <TechnologyTagModel[]>res.map((json) => service.fromJSON(json)))
            .catch(this.handleError);
    }
}