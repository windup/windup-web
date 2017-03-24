import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Constants} from "../constants";
import {AnalysisContext} from "windup-services";
import {AbstractService} from "../shared/abtract.service";
import {MigrationProject} from "windup-services";
import {Cached} from "../shared/cache.service";

@Injectable()
export class AnalysisContextService extends AbstractService {
    private ANALYSIS_CONTEXT_URL = "/analysis-context/{id}";
    private CREATE_URL = "/analysis-context/migrationProjects/{projectId}";

    constructor (private _http: Http) {
        super();
    }

    create(analysisContext: AnalysisContext, project: MigrationProject) {
        let body = JSON.stringify(analysisContext);
        let url = Constants.REST_BASE + this.CREATE_URL.replace('{projectId}', project.id.toString());

        return this._http.post(url, body, this.JSON_OPTIONS)
            .map(res => <AnalysisContext> res.json())
            .catch(this.handleError);
    }

    update(analysisContext: AnalysisContext) {
        let body = JSON.stringify(analysisContext);
        let url = Constants.REST_BASE + this.ANALYSIS_CONTEXT_URL.replace("{id}", analysisContext.id.toString());

        return this._http.put(url, body, this.JSON_OPTIONS)
            .map(res => <AnalysisContext> res.json())
            .catch(this.handleError);
    }

    @Cached('analysisContext')
    get(id: number) {
        return this._http.get(Constants.REST_BASE + this.ANALYSIS_CONTEXT_URL.replace("{id}", id.toString()))
            .map(res => <AnalysisContext> res.json())
            .catch(this.handleError);
    }
}
