import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Constants} from "../constants";
import {AnalysisContext} from "windup-services";
import {AbstractService} from "../shared/abtract.service";
import {MigrationProject} from "windup-services";
import {Cached} from "../shared/cache.service";

/**
 * Analysis context, AKA execution configuration, is tied 1:1 to executions.
 * Therefore, for each execution, a new configuration is created (typically on Save & Run).
 *
 * Also, the last configuration used for a project is that project's default configuration used to fill the Analysis page.
 */
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

    /**
     * Updating an analysis context only makes sense for those used as project default, i.e. those without an execution related to it.
     * Also, there should be only one such context.
     *
     * TODO: Throw if trying to update a context of a past execution.
     */
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
