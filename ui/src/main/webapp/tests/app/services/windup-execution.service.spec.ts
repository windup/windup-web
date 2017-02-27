import {fakeAsync, tick, discardPeriodicTasks} from "@angular/core/testing";

import {WindupService} from "../../../src/app/services/windup.service";
import {EventBusService} from "../../../src/app/services/events/event-bus.service";
import {WindupExecutionService} from "../../../src/app/services/windup-execution.service";
import {ApplicationGroup, WindupExecution} from "windup-services";
import {ExecutionEvent, NewExecutionStartedEvent} from "../../../src/app/services/events/windup-event";
import {Observable} from "rxjs";
import {SchedulerServiceMock} from "../mocks/scheduler-service.mock";

describe("WindupExecution service", () => {
    let group: ApplicationGroup = <ApplicationGroup>{ id: 10 };
    let windupServiceMock;
    let eventBusMock;
    let schedulerMock: SchedulerServiceMock;
    let windupExecutionService: WindupExecutionService;

    let getStatusGroup = (id) => {
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
            'executeWindupGroup',
            'getStatusGroup',
        ]);

        windupServiceMock.getStatusGroup.and.callFake((executionId) => {
            return Observable.of(getStatusGroup(executionId));
        });

        return windupServiceMock;
    }

    beforeEach(() => {
        windupServiceMock = getWindupServiceMock();
        eventBusMock = jasmine.createSpyObj('EventBusService', [
            'fireEvent'
        ]);
        schedulerMock = new SchedulerServiceMock();
        windupExecutionService = new WindupExecutionService(windupServiceMock, eventBusMock, schedulerMock);
    });

    describe('when executing execution', () => {
        let execution;
        let spy;

        beforeEach(() => {
            execution = getStatusGroup(1);
            windupServiceMock.executeWindupGroup.and.returnValue(Observable.of(execution));
            spy = spyOn(windupExecutionService, 'watchExecutionUpdates');
            windupExecutionService.execute(group).subscribe();
        });

        it('should fire event', fakeAsync(() => {
            let event = new NewExecutionStartedEvent(<any>execution, group, windupExecutionService);
            tick();
            expect(eventBusMock.fireEvent).toHaveBeenCalled();
            expect(eventBusMock.fireEvent).toHaveBeenCalledWith(event);
            discardPeriodicTasks();
        }));

        it('should listen for execution changes', (() => {
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(execution, group);
        }));
    });

    describe('when executing multiple executions on the same group', () => {
        let registeredExecutions = [];

        beforeEach(() => {
            windupServiceMock.executeWindupGroup.and.callFake((groupId) => {
                let execution = getStatusGroup(registeredExecutions.length + 1);
                registeredExecutions.push(execution);

                return Observable.of(execution);
            });

            windupExecutionService.execute(group).subscribe();
            windupExecutionService.execute(group).subscribe();
        });

        it('should listen for changes of all of them', () => {
            schedulerMock.intervalTick();
            expect(windupServiceMock.getStatusGroup).toHaveBeenCalledTimes(2);
            // TODO: Check parameters
        });
    });

    describe('after registering execution in watchExecutionUpdates', () => {
        let execution: WindupExecution;

        beforeEach(() => {
            execution = <any>getStatusGroup(1);
            windupExecutionService.watchExecutionUpdates(execution, group);
        });

        let assertIsNotListening = (state: string) => {
            expect(windupServiceMock.getStatusGroup).not.toHaveBeenCalled();
            schedulerMock.intervalTick();
            expect(windupServiceMock.getStatusGroup).toHaveBeenCalledTimes(1);
            expect(windupServiceMock.getStatusGroup).toHaveBeenCalledWith(execution.id);

            windupServiceMock.getStatusGroup.and.callFake((id) => {
                let object = Object.assign({}, execution, {state: state});
                return Observable.of(object);
            });

            schedulerMock.intervalTick(); // now it should get data with new state
            expect(windupServiceMock.getStatusGroup).toHaveBeenCalledTimes(2);

            schedulerMock.intervalTick(); // now it should not call getStatusGroup anymore
            expect(windupServiceMock.getStatusGroup).toHaveBeenCalledTimes(2);
        };

        it('should listen for execution changes', () => {
            schedulerMock.intervalTick();
            expect(windupServiceMock.getStatusGroup).toHaveBeenCalledWith(execution.id);
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
