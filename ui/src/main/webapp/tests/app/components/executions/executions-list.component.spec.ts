import {ComponentFixture, TestBed} from "@angular/core/testing";
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {RouterTestingModule} from "@angular/router/testing";
import {ExecutionsListComponent} from "../../../../src/app/executions/executions-list.component";
import {WindupService} from "../../../../src/app/services/windup.service";
import {NotificationService} from "../../../../src/app/core/notification/notification.service";
import {WindupExecution} from "windup-services";
import {EXECUTIONS_DATA} from "./executions-data";
import {Observable} from "rxjs";
import {ProgressBarComponent} from "../../../../src/app/shared/progress-bar.component";
import {ActiveExecutionsProgressbarComponent} from "../../../../src/app/executions/active-executions-progressbar.component";
import {DurationPipe} from "../../../../src/app/shared/duration.pipe";
import {MigrationProjectService} from "../../../../src/app/project/migration-project.service";
import {SortableTableComponent} from "../../../../src/app/shared/sort/sortable-table.component";
import {SortIndicatorComponent} from "../../../../src/app/shared/sort/sort-indicator.component";
import {StatusIconComponent} from "../../../../src/app/shared/status-icon.component";
import {SchedulerService} from "../../../../src/app/shared/scheduler.service";

let comp:    ExecutionsListComponent;
let fixture: ComponentFixture<ExecutionsListComponent>;
let de:      DebugElement;
let el:      HTMLElement;

let SORTED_EXECUTIONS_DATA = EXECUTIONS_DATA.slice().sort((a, b) => <any>b.timeStarted - <any>a.timeStarted);

const COL_ID = 0;
const COL_PROJECT = 1;
const COL_STATE = 2;
const COL_DATE_STARTED = 3;
const COL_DATE_COMPLETED = 4;
const COL_DURATION = 5;
const COL_ACTIONS = 6;

const COUNT_COLUMNS = 7;

let mockProjects = [
    { id: 1, title: 'Dummy project' }
];

describe('ExecutionsListComponent', () => {
    let executions: WindupExecution[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ RouterTestingModule ],
            declarations: [
                ExecutionsListComponent,
                ProgressBarComponent,
                ActiveExecutionsProgressbarComponent,
                DurationPipe,
                SortableTableComponent,
                SortIndicatorComponent,
                StatusIconComponent
            ],
            providers: [
                SchedulerService,
                {
                    provide: WindupService,
                    useValue: jasmine.createSpyObj('WindupService', [
                        'cancelExecution'
                    ])
                },
                {
                    provide: NotificationService,
                    useValue: jasmine.createSpyObj('NotificationService', [
                        'error',
                        'success'
                    ])
                },
                {
                    provide: MigrationProjectService,
                    useValue: jasmine.createSpyObj('MigrationProjectService', [
                        'getAll'
                    ])
                }
            ]
        });

        fixture = TestBed.createComponent(ExecutionsListComponent);
        comp = fixture.componentInstance;

        de = fixture.debugElement.query(By.css('table.executions-list-table'));
        el = de.nativeElement;

        let projectServiceMock = de.injector.get(MigrationProjectService);

        projectServiceMock.getAll.and.returnValue(Observable.of(mockProjects));

        comp.executions = <WindupExecution[]>SORTED_EXECUTIONS_DATA;
        fixture.detectChanges();
    });

    it('should display all windup executions', () => {
        let rows = fixture.debugElement.queryAll(By.css('tbody tr'));
        expect(rows.length).toEqual(SORTED_EXECUTIONS_DATA.length);
    });

    it('should display cancel link for QUEUED executions', () => {
        let rows = fixture.debugElement.queryAll(By.css('tbody tr'));

        let queuedExecutions = rows.filter(row => row.nativeElement.children[COL_STATE].textContent.trim() === 'QUEUED');

        expect(queuedExecutions.length).toBe(1);

        queuedExecutions.forEach(row => {
            let el = row.nativeElement;

            expect(el.children[COL_ACTIONS].children.length).toBe(1);
            expect(el.children[COL_ACTIONS].children[0].nodeName.toLowerCase()).toEqual('a');
            expect(el.children[COL_ACTIONS].children[0].textContent).toEqual('Cancel');
        });
    });

    it('should not display cancel link for executions in other state', () => {
        let rows = fixture.debugElement.queryAll(By.css('tbody tr'));

        let notQueuedExecutions = rows.filter(row => row.nativeElement.children[COL_STATE].textContent.trim() !== 'QUEUED');

        expect(notQueuedExecutions.length).toBe(4);

        notQueuedExecutions.forEach(row => {
            let el = row.nativeElement;
            let state = el.children[COL_STATE];
            let stateText = state.textContent ? state.textContent.trim() : "";

            if (stateText == "COMPLETED") {
                expect(el.children[COL_ACTIONS].children.length).toBe(0);
                expect(el.children[COL_ACTIONS].textContent.trim()).toEqual('');
            } else {
                expect(el.children[COL_ACTIONS].children.length).toBe(0);
                expect(el.children[COL_ACTIONS].textContent.trim()).toEqual('');
            }
        });
    });

    describe('should display windup execution data', () => {
        it('should correctly display dates', () => {
            let row = fixture.debugElement.queryAll(By.css('tbody tr'));

            let index = SORTED_EXECUTIONS_DATA.findIndex(item => <any>item.timeCompleted > 0);
            let el = row[index].nativeElement;
            let duration = <any>SORTED_EXECUTIONS_DATA[index].timeCompleted - <any>SORTED_EXECUTIONS_DATA[index].timeStarted;

            expect(el.children.length).toEqual(COUNT_COLUMNS);

            // TODO: Cannot test dates, they are timezone dependent. Find out way how to test this
            // expect(el.children[2].textContent).toEqual('10/31/2016, 10:54 AM');
            // expect(el.children[3].textContent).toEqual('10/31/2016, 10:54 AM');

            // NOTE: I'm not sure if this is not locale dependent
            let durationSeconds = Math.round(duration/1000);
            expect(el.children[COL_DURATION].textContent).toEqual(durationSeconds + ' seconds');
        });

        it('should display data', () => {
            let row = fixture.debugElement.queryAll(By.css('tbody tr'));

            for (let i = 0; i < SORTED_EXECUTIONS_DATA.length; i++) {
                let el = row[i].nativeElement;

                expect(el.children.length).toEqual(COUNT_COLUMNS);
                expect(el.children[COL_ID].textContent.trim()).toEqual(SORTED_EXECUTIONS_DATA[i].id.toString());
                expect(el.children[COL_STATE].textContent.trim()).toEqual(SORTED_EXECUTIONS_DATA[i].state);
                expect(el.children[COL_PROJECT].textContent.trim()).toEqual(mockProjects[0].title);
            }
        });
    });


    describe('after clicking on cancel', () => {
        let windupService;
        let notificationService;

        beforeEach(() => {
            windupService = de.injector.get(WindupService);
            notificationService = de.injector.get(NotificationService);
            windupService.cancelExecution.and.returnValue(new Observable<any>(observer => {
                let data = [];
                observer.next(data);
                observer.complete();
            }));

            let cancelLink = fixture.debugElement.query(By.css('tbody tr td a.cancel'));

            cancelLink.triggerEventHandler('click', null);
            fixture.detectChanges();
        });

        it('should call cancel method on windup service', () => {
            let queuedExecution = SORTED_EXECUTIONS_DATA.find(execution => execution.state === 'QUEUED');

            expect(windupService.cancelExecution).toHaveBeenCalledWith(queuedExecution);
        });

        describe('when cancellation completes successfully', () => {
            it('should create notification on success', () => {
                expect(notificationService.success).toHaveBeenCalledWith('Execution was successfully cancelled.');
            });
        });

        describe('when cancellation return error', () => {
            let errorMessage = 'Some unknown server error';
            beforeEach(() => {
                notificationService = de.injector.get(NotificationService);
                windupService.cancelExecution.and.returnValue(new Observable<any>(observer => {
                    let error = {error: errorMessage};
                    observer.error(error);
                    observer.complete();
                }));

                let cancelLink = fixture.debugElement.query(By.css('tbody tr td a.cancel'));
                cancelLink.triggerEventHandler('click', null);
                fixture.detectChanges();
            });

            it('should create notification on error', () => {
                expect(notificationService.error).toHaveBeenCalledWith(errorMessage);
            });
        });
    });
});
