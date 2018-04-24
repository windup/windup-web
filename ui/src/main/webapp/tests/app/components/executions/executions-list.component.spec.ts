import {ComponentFixture, TestBed} from "@angular/core/testing";
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {RouterTestingModule} from "@angular/router/testing";
import {ExecutionsListComponent} from "../../../../src/app/executions/executions-list.component";
import {WindupService} from "../../../../src/app/services/windup.service";
import {NotificationService} from "../../../../src/app/core/notification/notification.service";
import {WindupExecution} from "../../../../src/app/generated/windup-services";
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
import {PrettyExecutionStatus} from "../../../../src/app/shared/pretty-execution-state.pipe";
import {ConfirmationModalComponent} from "../../../../src/app/shared/dialog/confirmation-modal.component";
import {FormsModule} from "@angular/forms";
import {SearchComponent} from "../../../../src/app/shared/search/search.component";
import {WindupExecutionService} from "../../../../src/app/services/windup-execution.service";
import {AnalysisContextService} from "../../../../src/app/analysis-context/analysis-context.service";
import {RouteFlattenerService} from "../../../../src/app/core/routing/route-flattener.service";
import {AllDataFilteredMessageComponent} from "../../../../src/app/shared/all-data-filtered-message.component";

let comp:    ExecutionsListComponent;
let fixture: ComponentFixture<ExecutionsListComponent>;
let de:      DebugElement;
let el:      HTMLElement;

let SORTED_EXECUTIONS_DATA = EXECUTIONS_DATA.slice().sort((a, b) => {
    let timeA = a.timeStarted ? a.timeStarted : Number.MAX_SAFE_INTEGER;
    let timeB = b.timeStarted ? b.timeStarted : Number.MAX_SAFE_INTEGER;

    return <any>timeB - <any>timeA;
});

const COL_ID = 0;
const COL_STATE = 1;
const COL_DATE_STARTED = 2;
const COL_APPLICATION_ANALYZED = 3;
const COL_ACTIONS = 4;

const COUNT_COLUMNS = 5;

const ACTION_DETAIL = 0;
// const ACTION_DYNAMIC_REPORT = 1;
const ACTION_STATIC_REPORT = 1;
const ACTION_DELETE = 2;

let mockProjects = [
    { id: 1, title: 'Dummy project' }
];

describe('ExecutionsListComponent', () => {
    let executions: WindupExecution[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ RouterTestingModule, FormsModule ],
            declarations: [
                ExecutionsListComponent,
                ProgressBarComponent,
                ActiveExecutionsProgressbarComponent,
                DurationPipe,
                SortableTableComponent,
                SortIndicatorComponent,
                StatusIconComponent,
                PrettyExecutionStatus,
                ConfirmationModalComponent,
                SearchComponent,
                AllDataFilteredMessageComponent
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
                },
                {
                    provide: WindupExecutionService,
                    useValue: jasmine.createSpyObj('WindupExecutionService', [
                        'execute'
                    ])
                },
                {
                    provide: AnalysisContextService,
                    useValue: jasmine.createSpyObj('AnalysisContextService', [
                        'get'
                    ])
                },
                {
                    provide: RouteFlattenerService,
                    useValue: jasmine.createSpyObj('RouteFlattenerService', [
                        'getFlattenedRouteData'
                    ])
                }
            ]
        });

        fixture = TestBed.createComponent(ExecutionsListComponent);
        comp = fixture.componentInstance;

        let projectServiceMock: any = fixture.debugElement.injector.get(MigrationProjectService);

        projectServiceMock.getAll.and.returnValue(Observable.of(mockProjects));

        comp.executions = <WindupExecution[]>SORTED_EXECUTIONS_DATA;
        fixture.detectChanges();

        de = fixture.debugElement.query(By.css('table.executions-list-table'));
        el = de.nativeElement;
    });

    it('should display all windup executions', () => {
        let rows = fixture.debugElement.queryAll(By.css('tbody tr'));
        expect(rows.length).toEqual(SORTED_EXECUTIONS_DATA.length);
    });

    it('should display cancel link for QUEUED executions', () => {
        let rows = fixture.debugElement.queryAll(By.css('tbody tr'));

        let queuedExecutions = rows.filter(row => row.nativeElement.children[COL_STATE].textContent.trim().startsWith('Queued'));

        expect(queuedExecutions.length).toBe(1);

        queuedExecutions.forEach(row => {
            let el = row.nativeElement;

            expect(el.children[COL_ACTIONS].children.length).toBe(2);
            expect(el.children[COL_ACTIONS].children[0].nodeName.toLowerCase()).toEqual('a');
            expect(el.children[COL_ACTIONS].children[0].title).toEqual('Details');
            expect(el.children[COL_ACTIONS].children[1].nodeName.toLowerCase()).toEqual('a');
            expect(el.children[COL_ACTIONS].children[1].title).toEqual('Cancel');
        });
    });

    it('should not display cancel link for executions in other state', () => {
        let rows = fixture.debugElement.queryAll(By.css('tbody tr'));

        let notCompletedExecutions = rows.filter(row => {
            return !row.nativeElement.children[COL_STATE].textContent.trim().startsWith('Queued') &&
                !row.nativeElement.children[COL_STATE].textContent.trim().startsWith('In progress')
        });

        expect(notCompletedExecutions.length).toBe(3);

        notCompletedExecutions.forEach(row => {
            let el = row.nativeElement;
            let state = el.children[COL_STATE];
            let stateText = state.textContent ? state.textContent.trim() : "";

            if (stateText.startsWith("Completed")) {
                // details, view static report, view dynamic report, delete
                expect(el.children[COL_ACTIONS].children.length).toBe(3);
                expect(el.children[COL_ACTIONS].children[ACTION_DETAIL].title).toEqual('Details');
                expect(el.children[COL_ACTIONS].children[ACTION_STATIC_REPORT].children[0].title).toEqual('Show reports');
                expect(el.children[COL_ACTIONS].children[ACTION_DELETE].title).toEqual('Delete');
                // expect(el.children[COL_ACTIONS].children[ACTION_DYNAMIC_REPORT].text.trim()).toEqual('View Reports');
            } else {
                expect(el.children[COL_ACTIONS].children.length).toBe(2);
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
            expect(el.children[COL_STATE].textContent).toContain(durationSeconds + ' seconds');
        });

        it('should display data', () => {
            let row = fixture.debugElement.queryAll(By.css('tbody tr'));

            for (let i = 0; i < SORTED_EXECUTIONS_DATA.length; i++) {
                let el = row[i].nativeElement;

                expect(el.children.length).toEqual(COUNT_COLUMNS);
                expect(el.children[COL_ID].textContent.trim()).toEqual("#" + SORTED_EXECUTIONS_DATA[i].id.toString());
                expect(el.children[COL_STATE].textContent.trim()).toContain((new PrettyExecutionStatus().transform(SORTED_EXECUTIONS_DATA[i].state)));
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

            let confirmationButton = fixture.debugElement.query(By.css("#cancelExecutionDialog button.confirm-button"));
            confirmationButton.triggerEventHandler('click', null);
            fixture.detectChanges();
        });

        it('should call cancel method on windup service', () => {
            let queuedExecution = SORTED_EXECUTIONS_DATA.find(execution => execution.state === 'QUEUED' || execution.state === "STARTED");

            expect(windupService.cancelExecution).toHaveBeenCalledWith(queuedExecution);
        });

        describe('when cancellation completes successfully', () => {
            it('should create notification on success', () => {
                expect(notificationService.success).toHaveBeenCalledWith('Analysis #30 was cancelled.');
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

                let confirmationButton = fixture.debugElement.query(By.css("#cancelExecutionDialog button.confirm-button"));
                confirmationButton.triggerEventHandler('click', null);
                fixture.detectChanges();
            });

            it('should create notification on error', () => {
                expect(notificationService.error).toHaveBeenCalledWith(errorMessage);
            });
        });
    });
});
