import {fakeAsync, tick, discardPeriodicTasks} from "@angular/core/testing";

import {WindupService} from "../../../src/app/services/windup.service";
import {EventBusService} from "../../../src/app/core/events/event-bus.service";
import {WindupExecutionService} from "../../../src/app/services/windup-execution.service";
import {AnalysisContext, MigrationProject, WindupExecution} from "../../../src/app/generated/windup-services";
import {NewExecutionStartedEvent} from "../../../src/app/core/events/windup-event";
import {Observable} from "rxjs";
import {SchedulerServiceMock} from "../mocks/scheduler-service.mock";

describe("WindupExecution service", () => {
    let project: MigrationProject = <MigrationProject>{ id: 10 };
    let analysisContext: AnalysisContext = <AnalysisContext> { id: 10 };
    let windupServiceMock;
    let eventBusMock;
    let schedulerMock: SchedulerServiceMock;
    let windupExecutionService: WindupExecutionService;

    let getExecution = (id) => {
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

    function getWindupServiceMock() {
        let windupServiceMock = jasmine.createSpyObj('WindupService', [
            'executeWindupWithAnalysisContext',
            'getExecution',
        ]);

        windupServiceMock.getExecution.and.callFake((executionId) => {
            return Observable.of(getExecution(executionId));
        });

        return windupServiceMock;
    }

    beforeEach(() => {
        windupServiceMock = getWindupServiceMock();
        eventBusMock = jasmine.createSpyObj('EventBusService', [
            'fireEvent'
        ]);

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

        console.log("1Mock: ", eventBusMock);
        console.log("2Mock onEvent: " + eventBusMock.onEvent);
        console.log("3Mock onEvent: " + eventBusMock.onEvent.subscribe);

        schedulerMock = new SchedulerServiceMock();
        windupExecutionService = new WindupExecutionService(windupServiceMock, eventBusMock, schedulerMock);
    });

    describe('when executing execution', () => {
        let execution;
        let spy;

        beforeEach(() => {
            execution = getExecution(1);
            windupServiceMock.executeWindupWithAnalysisContext.and.returnValue(Observable.of(execution));
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

                return Observable.of(execution);
            });

            windupExecutionService.execute(analysisContext, project).subscribe();
            windupExecutionService.execute(analysisContext, project).subscribe();
        });

        it('should listen for changes of all of them', () => {
            schedulerMock.intervalTick();
            expect(windupServiceMock.getExecution).toHaveBeenCalledTimes(2);
            // TODO: Check parameters
        });
    });

    describe('after registering execution in watchExecutionUpdates', () => {
        let execution: WindupExecution;

        beforeEach(() => {
            execution = <any>getExecution(1);
            windupExecutionService.watchExecutionUpdates(execution, project);
        });

        let assertIsNotListening = (state: string) => {
            expect(windupServiceMock.getExecution).not.toHaveBeenCalled();
            schedulerMock.intervalTick();
            expect(windupServiceMock.getExecution).toHaveBeenCalledTimes(1);
            expect(windupServiceMock.getExecution).toHaveBeenCalledWith(execution.id);

            windupServiceMock.getExecution.and.callFake((id) => {
                let object = Object.assign({}, execution, {state: state});
                return Observable.of(object);
            });

            schedulerMock.intervalTick(); // now it should get data with new state
            expect(windupServiceMock.getExecution).toHaveBeenCalledTimes(2);

            schedulerMock.intervalTick(); // now it should not call getExecution anymore
            expect(windupServiceMock.getExecution).toHaveBeenCalledTimes(2);
        };

        it('should listen for execution changes', () => {
            schedulerMock.intervalTick();
            expect(windupServiceMock.getExecution).toHaveBeenCalledWith(execution.id);
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
