///<reference path="../shared/cache.service.ts"/>
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {Constants} from "../constants";
import {AnalysisContext, MigrationProject, WindupExecution} from "../generated/windup-services";
import {AbstractService} from "../shared/abtract.service";
import {Cached, getCacheServiceInstance} from "../shared/cache.service";
import {EventBusService} from "../core/events/event-bus.service";
import { map, catchError, tap } from 'rxjs/operators';

@Injectable()
export class WindupService extends AbstractService {
    private EXECUTE_WITH_CONTEXT_PATH = Constants.REST_BASE + "/windup/execute-project-with-context/{projectId}";
    private EXECUTIONS_PATH = '/windup/executions';
    private LOGS_PATH = '/logs';
    private PROJECT_EXECUTIONS_PATH = '/windup/by-project/{projectId}';

    constructor (private _http: HttpClient, private _eventBus: EventBusService) {
        super();
    }

    /**
     * When execution is COMPLETED or FAILED it can be cached and treated as immutable
     *
     * @param execution {WindupExecution}
     * @returns {boolean}
     */
    static cacheExecution = (execution: WindupExecution): boolean => {
        return execution.state === "COMPLETED" || execution.state === "FAILED";
    };

    static cacheExecutionList = (executions: WindupExecution[]): boolean => {
        return executions.find(execution => !WindupService.cacheExecution(execution)) == null;
    };

    @Cached({section: 'execution', immutable: true, cacheItemCallback: WindupService.cacheExecution})
    public getExecution(executionID: number): Observable<WindupExecution> {
        let url = Constants.REST_BASE + this.EXECUTIONS_PATH + '/' + executionID;

        return this._http.get<WindupExecution>(url);
    }

    public executeWindupWithAnalysisContext(context: AnalysisContext, project: MigrationProject): Observable<WindupExecution> {
        let url = this.EXECUTE_WITH_CONTEXT_PATH.replace('{projectId}', project.id.toString());

        let body = JSON.stringify(context);

        return this._http.post<WindupExecution>(url, body, this.JSON_OPTIONS)
            .pipe(
                tap(res => {
                    getCacheServiceInstance().getSection('execution').clear();
                })
            );
    }

    @Cached({section: 'execution', cacheItemCallback: WindupService.cacheExecutionList})
    public getAllExecutions(): Observable<WindupExecution[]> {
        return this._http.get<WindupExecution[]>(Constants.REST_BASE + this.EXECUTIONS_PATH);
    }

    @Cached({section: 'execution', cacheItemCallback: WindupService.cacheExecutionList})
    public getProjectExecutions(projectId: number): Observable<WindupExecution[]> {
        let url = Constants.REST_BASE + this.PROJECT_EXECUTIONS_PATH.replace('{projectId}', projectId.toString());

        return this._http.get<WindupExecution[]>(url);
    }

    public getLogData(executionID: number): Observable<string[]> {
        let url = Constants.REST_BASE + this.EXECUTIONS_PATH + '/' + executionID + this.LOGS_PATH;

        return this._http.get<string[]>(url);
    }

    public cancelExecution(execution: WindupExecution): Observable<any> {
        return this._http.post(Constants.REST_BASE + this.EXECUTIONS_PATH + '/' + execution.id + '/cancel' , null);
    }

    public deleteExecution(execution: WindupExecution): Observable<any> {
        return this._http.delete(Constants.REST_BASE + this.EXECUTIONS_PATH + '/' + execution.id, this.JSON_OPTIONS);
    }
}
