import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Constants} from "../constants";
import {AnalysisContext} from "windup-services";
import {AbstractService} from "../shared/abtract.service";

@Injectable()
export class AnalysisContextService extends AbstractService {
    private GET_URL = "/analysis-context/get";
    private CREATE_URL = "/analysis-context/create";
    private UPDATE_URL = "/analysis-context/update";

    constructor (private _http: Http) {
        super();
    }

    create(analysisContext: AnalysisContext) {
        let body = JSON.stringify(analysisContext);

        return this._http.put(Constants.REST_BASE + this.CREATE_URL, body, this.JSON_OPTIONS)
            .map(res => <AnalysisContext> res.json())
            .catch(this.handleError);
    }

    update(analysisContext: AnalysisContext) {
        let body = JSON.stringify(analysisContext);

        return this._http.put(Constants.REST_BASE + this.UPDATE_URL, body, this.JSON_OPTIONS)
            .map(res => <AnalysisContext> res.json())
            .catch(this.handleError);
    }

    get(id: number) {
        return this._http.get(Constants.REST_BASE + this.GET_URL + "/" + id)
            .map(res => <AnalysisContext> res.json())
            .catch(this.handleError);
    }
}
