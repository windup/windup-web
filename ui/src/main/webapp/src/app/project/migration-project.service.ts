import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';

import {Constants} from "../constants";
import {MigrationProject} from "windup-services";
import {AbstractService} from "../shared/abtract.service";
import {Observable} from "rxjs";
import {isNumber} from "util";
import {
    MigrationProjectEvent, NewExecutionStartedEvent, ExecutionUpdatedEvent,
    ApplicationRegisteredEvent, ApplicationDeletedEvent, UpdateMigrationProjectEvent, DeleteMigrationProjectEvent
} from "../core/events/windup-event";
import {EventBusService} from "../core/events/event-bus.service";
import {AnalysisContext} from "windup-services";
import {Cached} from "../shared/cache.service";

@Injectable()
export class MigrationProjectService extends AbstractService {
    private GET_MIGRATION_PROJECTS_URL = "/migrationProjects/list";
    private GET_MIGRATION_PROJECT_URL = "/migrationProjects/get";
    private CREATE_MIGRATION_PROJECT_URL = "/migrationProjects/create";
    private UPDATE_MIGRATION_PROJECT_URL = "/migrationProjects/update";
    private DELETE_MIGRATION_PROJECT_URL = '/migrationProjects/delete';
    private GET_ID_BY_NAME_URL = '/migrationProjects/id-by-name';

    private monitoredProjects = new Map<number, MigrationProject>();

    constructor (private _http: Http, private _eventBus: EventBusService) {
        super();

        this._eventBus.onEvent.filter(event => event.source !== this)
            .filter(event => event.isTypeOf(MigrationProjectEvent))
            .subscribe((event: MigrationProjectEvent) => this.handleEvent(event));
    }

    handleEvent(event: MigrationProjectEvent) {
        if (!event.migrationProject || (event.migrationProject && !this.monitoredProjects.has(event.migrationProject.id))) {
            return;
        }

        let monitoredProject = this.monitoredProjects.get(event.migrationProject.id);

        if (event.isTypeOf(NewExecutionStartedEvent)) {
            monitoredProject.executions.push((<NewExecutionStartedEvent>event).execution);
        } else if (event.isTypeOf(ExecutionUpdatedEvent)) {
            let currentExecutionIndex = -1;
            let eventExecution = (<ExecutionUpdatedEvent>event).execution;

            for (let index in monitoredProject.executions) {
                if (eventExecution.id === monitoredProject.executions[index].id) {
                    currentExecutionIndex = <any>index;
                    break;
                }
            }

            if (currentExecutionIndex !== -1) {
                monitoredProject.executions[currentExecutionIndex] = eventExecution;
            } else {
                monitoredProject.executions.push(eventExecution);
            }
        } else if (event.isTypeOf(ApplicationRegisteredEvent)) {
            // create new array by merging project and event arrays together
            monitoredProject.applications = [...monitoredProject.applications, ...(<any>event).applications];
        } else if (event.isTypeOf(ApplicationDeletedEvent)) {
            monitoredProject.applications = monitoredProject.applications.filter((app) => {
                // keep only those items which are not in event applications
                return (<any>event).applications.findIndex(eventApp => eventApp.id === app.id) === -1;
            });
        }

        this._eventBus.fireEvent(new UpdateMigrationProjectEvent(monitoredProject, this));
    }

    create(migrationProject: MigrationProject): Observable<MigrationProject> {
        let body = JSON.stringify(migrationProject);

        return this._http.put(Constants.REST_BASE + this.CREATE_MIGRATION_PROJECT_URL, body, this.JSON_OPTIONS)
            .map(res => <MigrationProject> res.json())
            .catch(this.handleError);
    }

    update(migrationProject: MigrationProject): Observable<MigrationProject> {
        let body = JSON.stringify(migrationProject);

        return this._http.put(Constants.REST_BASE + this.UPDATE_MIGRATION_PROJECT_URL, body, this.JSON_OPTIONS)
            .map(res => <MigrationProject> res.json())
            .catch(this.handleError);
    }

    delete(migrationProject: MigrationProject): Observable<void> {
        let body = JSON.stringify(migrationProject);

        let options = new RequestOptions({
            body: body,
            headers: new Headers()
        });

        options.headers.append('Content-Type', 'application/json');
        options.headers.append('Accept', 'application/json');

        return this._http.delete(Constants.REST_BASE + this.DELETE_MIGRATION_PROJECT_URL, options)
            .map(res => res.json())
            .do(res => this._eventBus.fireEvent(new DeleteMigrationProjectEvent(migrationProject, this)))
            .catch(this.handleError);
    }

    @Cached('project')
    get(id: number): Observable<MigrationProject> {
        if (!isNumber(id)) {
            throw new Error("Not a project ID: " + id);
        }
        return this._http.get(Constants.REST_BASE + this.GET_MIGRATION_PROJECT_URL + "/" + id)
            .map(res => <MigrationProject> res.json())
            .catch(this.handleError);
    }

    @Cached('project', {minutes: 1})
    getAll(): Observable<Array<MigrationProject & HasAppCount>> {
        return this._http.get(Constants.REST_BASE + this.GET_MIGRATION_PROJECTS_URL)
            .map(res => <MigrationProjectAndCount[]> res.json())
            // The consuming code still sees  MigrationProject, only with .appCount added.
            .map(entries => entries.map(entry => (entry.migrationProject["applicationCount"] = entry.applicationCount, entry.migrationProject)))
            .catch(this.handleError);
    }

    monitorProject(project: MigrationProject) {
        this.monitoredProjects.set(project.id, project);
    }

    stopMonitoringProject(project: MigrationProject) {
        this.monitoredProjects.delete(project.id);
    }

    getIdByName(name: string): Observable<number> | null {
        return this._http.get(Constants.REST_BASE + this.GET_ID_BY_NAME_URL + "/" + encodeURIComponent(name))
            .map(res => <number> res.json())
            .catch(this.handleError);
    }
}

export interface HasAppCount{ applicationCount: number; }
type MigrationProjectAndCount = { migrationProject: MigrationProject } & HasAppCount;
