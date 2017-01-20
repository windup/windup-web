import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';

import {Constants} from "../constants";
import {ApplicationGroup, PackageMetadata} from "windup-services";
import {AbstractService} from "./abtract.service";
import {Observable, Subject} from "rxjs";
import {EventBusService} from "./events/event-bus.service";
import {
    ApplicationGroupEvent, NewExecutionStartedEvent, ExecutionUpdatedEvent,
    ApplicationRegisteredEvent, ApplicationDeletedEvent, UpdateApplicationGroupEvent
} from "./events/windup-event";

@Injectable()
export class ApplicationGroupService extends AbstractService {
    private applicationGroupLoadedSubject = new Subject<ApplicationGroup>();
    applicationGroupLoaded:Observable<ApplicationGroup> = this.applicationGroupLoadedSubject.asObservable();

    protected monitoredGroups: Map<number, ApplicationGroup> = new Map<number, ApplicationGroup>();

    private GET_ALL_URL = "/applicationGroups/list";
    private GET_BY_PROJECT_URL = "/applicationGroups/by-project/";
    private GET_BY_ID_URL = "/applicationGroups/get";
    private PACKAGE_METADATA = "/applicationGroups/#{groupID}/packages";
    private CREATE_URL = "/applicationGroups/create";
    private UPDATE_URL = "/applicationGroups/update";
    private DELETE_URL = '/applicationGroups/delete';

    constructor (private _http: Http, private _eventBus: EventBusService) {
        super();

        this._eventBus.onEvent.filter(event => event.source !== this)
            .filter(event => event.isTypeOf(ApplicationGroupEvent))
            .subscribe((event: ApplicationGroupEvent) => this.handleEvent(event));
    }

    handleEvent(event: ApplicationGroupEvent) {
        if (!event.group || (event.group && !this.monitoredGroups.has(event.group.id))) {
            return;
        }

        let monitoredGroup = this.monitoredGroups.get(event.group.id);

        if (event.isTypeOf(NewExecutionStartedEvent)) {
            monitoredGroup.executions.push((<NewExecutionStartedEvent>event).execution);
        } else if (event.isTypeOf(ExecutionUpdatedEvent)) {
            let currentExecutionIndex = -1;
            let eventExecution = (<ExecutionUpdatedEvent>event).execution;

            for (let index in monitoredGroup.executions) {
                if (eventExecution.id === monitoredGroup.executions[index].id) {
                    currentExecutionIndex = <any>index;
                    break;
                }
            }
            if (currentExecutionIndex !== -1) {
                monitoredGroup.executions[currentExecutionIndex] = eventExecution;
            } else {
                monitoredGroup.executions.push(eventExecution);
            }
        } else if (event.isTypeOf(ApplicationRegisteredEvent)) {
            (<ApplicationRegisteredEvent>event).applications.forEach(application => {
                monitoredGroup.applications.push(application);
            });
        } else if (event.isTypeOf(ApplicationDeletedEvent)) {
            let applicationToRemoveIds = (<ApplicationRegisteredEvent>event).applications.map(app => app.id);
            let applicationsToRemoveIndices = monitoredGroup.applications.map((app, index) => {
                if (applicationToRemoveIds.indexOf(app.id) !== -1) {
                    return index;
                } else {
                    return -1;
                }
            }).filter(index => index >= 0)
                .sort((a, b) => b - a);

            applicationsToRemoveIndices.forEach(appIndex => {
                monitoredGroup.applications.splice(appIndex, 1);
            });
        }

        this._eventBus.fireEvent(new UpdateApplicationGroupEvent(monitoredGroup, this));
    }

    monitorGroup(applicationGroup: ApplicationGroup) {
        this.monitoredGroups.set(applicationGroup.id, applicationGroup);
    }

    stopMonitoringGroup(applicationGroup: ApplicationGroup) {
        this.monitoredGroups.delete(applicationGroup.id);
    }

    create(applicationGroup: ApplicationGroup) {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let body = JSON.stringify(applicationGroup);

        return this._http.put(Constants.REST_BASE + this.CREATE_URL, body, options)
            .map(res => <ApplicationGroup> res.json())
            .do(group => this.applicationGroupLoadedSubject.next(group))
            .catch(this.handleError);
    }

    update(applicationGroup: ApplicationGroup) {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let body = JSON.stringify(applicationGroup);

        return this._http.put(Constants.REST_BASE + this.UPDATE_URL, body, options)
            .map(res => <ApplicationGroup> res.json())
            .do(group => this.applicationGroupLoadedSubject.next(group))
            .catch(this.handleError);
    }

    delete(applicationGroup: ApplicationGroup) {
        let body = JSON.stringify(applicationGroup);

        let options = new RequestOptions({
            body: body,
            headers: new Headers()
        });

        options.headers.append('Content-Type', 'application/json');
        options.headers.append('Accept', 'application/json');

        return this._http.delete(Constants.REST_BASE + this.DELETE_URL, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    get(id:number): Observable<ApplicationGroup> {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        return this._http.get(Constants.REST_BASE + this.GET_BY_ID_URL + "/" + id, options)
            .map(res => <ApplicationGroup> res.json())
            .do(group => this.applicationGroupLoadedSubject.next(group))
            .catch(this.handleError);
    }

    getPackageMetadata(id:number): Observable<PackageMetadata> {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });

        let url = this.PACKAGE_METADATA.replace("#{groupID}", id.toString());

        return this._http.get(Constants.REST_BASE + url, options)
            .map(res => <ApplicationGroup> res.json())
            .catch(this.handleError);
    }

    getByProjectID(projectID: number) {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });

        return this._http.get(Constants.REST_BASE + this.GET_BY_PROJECT_URL + projectID, options)
            .map(res => <ApplicationGroup[]> res.json())
            .do(groups => groups.forEach(group => this.applicationGroupLoadedSubject.next(group)))
            .catch(this.handleError);
    }

    getAll() {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });

        return this._http.get(Constants.REST_BASE + this.GET_ALL_URL, options)
            .map(res => <ApplicationGroup[]> res.json())
            .do(groups => groups.forEach(group => this.applicationGroupLoadedSubject.next(group)))
            .catch(this.handleError);
    }
}
