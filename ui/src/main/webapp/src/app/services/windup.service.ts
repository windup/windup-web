///<reference path="../shared/cache.service.ts"/>
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Constants} from "../constants";
import {AnalysisContext, MigrationProject, WindupExecution} from "../generated/windup-services";
import {AbstractService} from "../shared/abtract.service";
import {Cached, getCacheServiceInstance} from "../shared/cache.service";
import {EventBusService} from "../core/events/event-bus.service";

@Injectable()
export class WindupService extends AbstractService {
    private EXECUTE_WITH_CONTEXT_PATH = Constants.REST_BASE + "/windup/execute-project-with-context/{projectId}";
    private EXECUTIONS_PATH = '/windup/executions';
    private LOGS_PATH = '/logs';
    private PROJECT_EXECUTIONS_PATH = '/windup/by-project/{projectId}';

    constructor (private _http: Http, private _eventBus: EventBusService) {
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
        if (isNaN(executionID)){
            console.error("The executionID is NaN");
            throw new Error("The executionID is NaN");
        }

        let url = Constants.REST_BASE + this.EXECUTIONS_PATH + '/' + executionID;

        return this._http.get(url)
            .map(res => <WindupExecution> res.json())
            .catch(this.handleError);
    }

    public executeWindupWithAnalysisContext(context: AnalysisContext, project: MigrationProject): Observable<WindupExecution> {
        let url = this.EXECUTE_WITH_CONTEXT_PATH.replace('{projectId}', project.id.toString());

        let body = JSON.stringify(context);

        return this._http.post(url, body, this.JSON_OPTIONS)
            .map(res => <WindupExecution> res.json())
            .do(res => {
                getCacheServiceInstance().getSection('execution').clear();
            })
            .catch(this.handleError);
    }

    @Cached({section: 'execution', cacheItemCallback: WindupService.cacheExecutionList})
    public getAllExecutions(): Observable<WindupExecution[]> {
        return this._http.get(Constants.REST_BASE + this.EXECUTIONS_PATH)
            .map(res => <WindupExecution[]> res.json())
            .catch(this.handleError);
    }

    @Cached({section: 'execution', cacheItemCallback: WindupService.cacheExecutionList})
    public getProjectExecutions(projectId: number): Observable<WindupExecution[]> {
        let url = Constants.REST_BASE + this.PROJECT_EXECUTIONS_PATH.replace('{projectId}', projectId.toString());

        return this._http.get(url)
            .map(res => res.json())
            .catch(this.handleError);
    }

    public getLogData(executionID: number): Observable<string[]> {
        let url = Constants.REST_BASE + this.EXECUTIONS_PATH + '/' + executionID + this.LOGS_PATH;

        return this._http.get(url)
            .map(res => <WindupExecution> res.json())
            .catch(this.handleError);
    }

    public cancelExecution(execution: WindupExecution): Observable<any> {
        return this._http.post(Constants.REST_BASE + this.EXECUTIONS_PATH + '/' + execution.id + '/cancel' , null)
            .catch(this.handleError);
    }

    public deleteExecution(execution: WindupExecution): Observable<any> {
        return this._http.delete(Constants.REST_BASE + this.EXECUTIONS_PATH + '/' + execution.id, this.JSON_OPTIONS)
            .catch(this.handleError);
    }
}
