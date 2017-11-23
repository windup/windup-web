import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Constants} from "../constants";
import {AnalysisContext, MigrationProject} from "../generated/windup-services";
import {AbstractService} from "../shared/abtract.service";
import {Cached, CacheSection, CacheService} from "../shared/cache.service";
import {Observable} from "rxjs";

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

    private _cache: CacheSection;

    constructor (private _http: HttpClient, private _cacheService: CacheService) {
        super();
        this._cache = _cacheService.getSection('analysisContext');
    }

    /**
     * Saves analysis context as project default context
     *
     * @param analysisContext {AnalysisContext}
     * @param project {MigrationProject}
     * @returns {Observable<AnalysisContext>}
     */
    saveAsDefault(analysisContext: AnalysisContext, project: MigrationProject): Observable<AnalysisContext> {
        let body = JSON.stringify(analysisContext);
        let url = Constants.REST_BASE + this.CREATE_URL.replace('{projectId}', project.id.toString());

        return this._http.put(url, body, this.JSON_OPTIONS)
            .do((context: AnalysisContext) => {
                // invalidate cache for just updated context
                let key = 'get(' + context.id + ')';
                this._cache.removeItem(key);
            })
            .catch(this.handleError);
    }

    @Cached('analysisContext')
    get(id: number) {
        return this._http.get(Constants.REST_BASE + this.ANALYSIS_CONTEXT_URL.replace("{id}", id.toString()))
            .catch(this.handleError);
    }
}
