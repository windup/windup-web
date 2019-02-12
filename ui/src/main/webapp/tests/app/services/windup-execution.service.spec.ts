import {fakeAsync, tick, discardPeriodicTasks} from "@angular/core/testing";

import {WindupService} from "../../../src/app/services/windup.service";
import {EventBusService} from "../../../src/app/core/events/event-bus.service";
import {WindupExecutionService} from "../../../src/app/services/windup-execution.service";
import {AnalysisContext, MigrationProject, WindupExecution} from "../../../src/app/generated/windup-services";
import {NewExecutionStartedEvent} from "../../../src/app/core/events/windup-event";
import {Observable, Subject, Subscription, of} from "rxjs";
import {WebSocketSubjectFactory} from "../../../src/app/shared/websocket.factory";
import {Subscribable} from "rxjs";

export class WebSocketMock<T> extends Subscription implements Subscribable<T>
{
    closed: boolean;
    subject: Subject<T> = new Subject<T>();

    subscribe(next?: any, error?: (error: any) => void, complete?: () => void): Subscription {
        return this.subject.subscribe(next, error, complete);
    }

    next(data: T) {
        /**
         * Do not emit data if type is string.
         * In that case it is authorization token and it is message for server.
         */
        if (typeof data !== 'string') {
            this.subject.next(data);
        }
    }

    unsubscribe(): void {
        this.subject.unsubscribe();
    }
}

describe("WindupExecution service", () => {
    let project: MigrationProject = <MigrationProject>{ id: 10 };
    let analysisContext: AnalysisContext = <AnalysisContext> { id: 10 };
    let windupServiceMock;
    let eventBusMock;
    let websocketFactoryMock: WebSocketSubjectFactory<WindupExecution>;
    let windupExecutionService: WindupExecutionService;

    let executionSubject: Subject<WindupExecution>;
    let countExecutionSubjectCalls: number;

    let getExecution = (id): any => {
        return {
            "id": id,
            "version": 1,
            "timeStarted": 1477907641905,
            "timeCompleted": 1477907647229,
            "outputPath": "/home/dklingen/apps/wildfly-10.1.0.Final/standalone/data/windup/reports/Default Group.ANnIuZsNxbfq.report",
            "totalWork": 0,
            "workCompleted": 0,
            "currentTask": null,
            "lastModified": 1477907647318,
            "state": "QUEUED",
            "analysisContext": null,
            "outputDirectoryName": "Default Group.ANnIuZsNxbfq.report",
            "applicationListRelativePath": "Default Group.ANnIuZsNxbfq.report/index.html"
        };
    };

    function getWindupServiceMock(executionSubject) {
        let windupServiceMock = jasmine.createSpyObj('WindupService', [
            'executeWindupWithAnalysisContext',
            'getExecution',
        ]);

        windupServiceMock.getExecution.and.callFake((executionId) => {
            return executionSubject;
        });

        return windupServiceMock;
    }

    function getWebSocketFactoryMock(executionSubject) {
        const websocketFactoryMock = jasmine.createSpyObj('WebSocketSubjectFactory', [
            'createWebSocketSubject'
        ]);

        websocketFactoryMock.createWebSocketSubject.and.callFake((url: string) => {
            return executionSubject;
        });

        return websocketFactoryMock;
    }

    function callExecutionSubject(execution: WindupExecution) {
        executionSubject.next(execution);
        countExecutionSubjectCalls++;
    }

    function createKeycloakMock(): any {
        const keycloakMock = jasmine.createSpyObj('KeycloakService', [
            'getToken'
        ]);

        keycloakMock.getToken.and.callFake(() => of('token'));

        return keycloakMock;
    }

    beforeEach(() => {
        executionSubject = new WebSocketMock<WindupExecution>() as any;
        countExecutionSubjectCalls = 0;

        windupServiceMock = getWindupServiceMock(executionSubject);
        eventBusMock = jasmine.createSpyObj('EventBusService', [
            'fireEvent'
        ]);

        websocketFactoryMock = getWebSocketFactoryMock(executionSubject);

        Object.defineProperty(eventBusMock, 'onEvent', {
            value: {
                filter: () => {
                    return {
                        filter: () => {
                            return {
                                subscribe: () => {}
                            }
                        },
                        subscribe: () => {}
                    }
                }
            }
        });

        const keyCloak = createKeycloakMock();

        windupExecutionService = new WindupExecutionService(windupServiceMock, eventBusMock, websocketFactoryMock, keyCloak);
    });

    afterEach(() => {
        executionSubject.unsubscribe();
    });

    describe('when executing execution', () => {
        let execution;
        let spy;

        beforeEach(() => {
            execution = getExecution(1);
            windupServiceMock.executeWindupWithAnalysisContext.and.returnValue(of(execution));
            spy = spyOn(windupExecutionService, 'watchExecutionUpdates');
            windupExecutionService.execute(analysisContext, project).subscribe();
        });

        it('should fire event', fakeAsync(() => {
            let event = new NewExecutionStartedEvent(<any>execution, project, windupExecutionService);
            tick();
            expect(eventBusMock.fireEvent).toHaveBeenCalled();
            expect(eventBusMock.fireEvent).toHaveBeenCalledWith(event);
            discardPeriodicTasks();
        }));

        it('should listen for execution changes', (() => {
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(execution, project);
        }));
    });

    describe('when executing multiple executions on the same group', () => {
        let registeredExecutions = [];

        beforeEach(() => {
            windupServiceMock.executeWindupWithAnalysisContext.and.callFake((groupId) => {
                let execution = getExecution(registeredExecutions.length + 1);
                registeredExecutions.push(execution);

                return of(execution);
            });

            windupExecutionService.execute(analysisContext, project).subscribe();
            windupExecutionService.execute(analysisContext, project).subscribe();
        });

        it('should listen for changes of all of them', () => {
            expect(websocketFactoryMock.createWebSocketSubject).toHaveBeenCalledTimes(2);
            // TODO: Check parameters
        });
    });

    describe('after registering execution in watchExecutionUpdates', () => {
        let execution: WindupExecution;
        let onExecutionUpdateSpy;
        let executionId;

        beforeEach(() => {
            executionId = 1;
            execution = <any>getExecution(executionId);
            onExecutionUpdateSpy = spyOn(windupExecutionService, 'onExecutionUpdate').and.callThrough();
            onExecutionUpdateSpy.calls.reset();
            windupExecutionService.watchExecutionUpdates(execution, project);
        });

        let assertIsNotListening = (state: string) => {
            expect(onExecutionUpdateSpy).not.toHaveBeenCalled();
            callExecutionSubject(getExecution(1) as any);
            expect(onExecutionUpdateSpy).toHaveBeenCalledTimes(1);
            expect(onExecutionUpdateSpy).toHaveBeenCalledWith(execution);

            const getUpdatedExecution = (id): any => {
                return Object.assign({}, execution, {state: state});
            };

            callExecutionSubject(getUpdatedExecution(executionId));
            expect(onExecutionUpdateSpy).toHaveBeenCalledTimes(2);

            // this call should happen after .unsubscribe is called
            try {
                callExecutionSubject(getUpdatedExecution(executionId));
            } catch (e) {
                expect(e.name).toBe('ObjectUnsubscribedError');
                expect(onExecutionUpdateSpy).toHaveBeenCalledTimes(2);
            }
        };

        it('should listen for execution changes', () => {
            let expectedExecution = getExecution(executionId);
            callExecutionSubject(expectedExecution);
            expect(onExecutionUpdateSpy).toHaveBeenCalledWith(execution);
        });

        it('should stop listening once execution reaches COMPLETE state', () => {
            assertIsNotListening('COMPLETE');
        });

        it('should stop listening once execution reaches CANCELED state', () => {
            assertIsNotListening('CANCELED');
        });

        it ('should stop listening once execution reaches FAILED state', () => {
            assertIsNotListening('FAILED');
        });
    });
});
