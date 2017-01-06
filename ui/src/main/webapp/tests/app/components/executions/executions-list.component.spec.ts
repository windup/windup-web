import {ComponentFixture, TestBed} from "@angular/core/testing";
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {RouterTestingModule} from "@angular/router/testing";
import {ExecutionsListComponent} from "../../../../src/app/components/executions/executions-list.component";
import {WindupService} from "../../../../src/app/services/windup.service";
import {NotificationService} from "../../../../src/app/services/notification.service";
import {WindupExecution} from "windup-services";
import {EXECUTIONS_DATA} from "./executions-data";
import {Observable} from "rxjs";
import {ProgressBarComponent} from "../../../../src/app/components/progress-bar.component";
import {ActiveExecutionsProgressbarComponent} from "../../../../src/app/components/executions/active-executions-progressbar.component";

let comp:    ExecutionsListComponent;
let fixture: ComponentFixture<ExecutionsListComponent>;
let de:      DebugElement;
let el:      HTMLElement;

describe('ExecutionsListComponent', () => {
    let executions: WindupExecution[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ RouterTestingModule ],
            declarations: [ ExecutionsListComponent, ProgressBarComponent, ActiveExecutionsProgressbarComponent ],
            providers: [
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
                }
            ]
        });

        fixture = TestBed.createComponent(ExecutionsListComponent);
        comp = fixture.componentInstance;

        de = fixture.debugElement.query(By.css('table.executions-list-table'));
        el = de.nativeElement;

        comp.executions = EXECUTIONS_DATA;
        fixture.detectChanges();
    });

    it('should display all windup executions', () => {
        let rows = fixture.debugElement.queryAll(By.css('tbody tr'));
        expect(rows.length).toEqual(EXECUTIONS_DATA.length);
    });

    it('should display cancel link for QUEUED executions', () => {
        let rows = fixture.debugElement.queryAll(By.css('tbody tr'));

        let queuedExecutions = rows.filter(row => row.nativeElement.children[1].textContent.trim() === 'QUEUED');

        expect(queuedExecutions.length).toBe(1);

        queuedExecutions.forEach(row => {
            let el = row.nativeElement;

            expect(el.children[5].children.length).toBe(1);
            expect(el.children[5].children[0].nodeName.toLowerCase()).toEqual('a');
            expect(el.children[5].children[0].textContent).toEqual('Cancel');
        });
    });

    it('should not display cancel link for executions in other state', () => {
        let rows = fixture.debugElement.queryAll(By.css('tbody tr'));

        let notQueuedExecutions = rows.filter(row => row.nativeElement.children[1].textContent.trim() !== 'QUEUED');

        expect(notQueuedExecutions.length).toBe(4);

        notQueuedExecutions.forEach(row => {
            let el = row.nativeElement;
            expect(el.children[5].children.length).toBe(0);
            expect(el.children[5].textContent).toEqual('');
        });
    });

    describe('should display windup execution data', () => {
        it('should correctly display dates', () => {
            let row = fixture.debugElement.query(By.css('tbody tr'));
            let el = row.nativeElement;

            expect(el.children.length).toEqual(6);

            // TODO: Cannot test dates, they are timezone dependent. Find out way how to test this
            // expect(el.children[2].textContent).toEqual('10/31/2016, 10:54 AM');
            // expect(el.children[3].textContent).toEqual('10/31/2016, 10:54 AM');
            expect(el.children[4].textContent).toEqual('5324');
        });

        it('should display data', () => {
            let row = fixture.debugElement.queryAll(By.css('tbody tr'));

            for (let i = 0; i < EXECUTIONS_DATA.length; i++) {
                let el = row[i].nativeElement;

                expect(el.children.length).toEqual(6);
                expect(el.children[0].textContent.trim()).toEqual(EXECUTIONS_DATA[i].id.toString());
                expect(el.children[1].textContent.trim()).toEqual(EXECUTIONS_DATA[i].state);
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

            let cancelLink = fixture.debugElement.query(By.css('tbody tr td a.link'));

            cancelLink.triggerEventHandler('click', null);
            fixture.detectChanges();
        });

        it('should call cancel method on windup service', () => {
            expect(windupService.cancelExecution).toHaveBeenCalledWith(EXECUTIONS_DATA[3]);
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

                let cancelLink = fixture.debugElement.query(By.css('tbody tr td a.link'));
                cancelLink.triggerEventHandler('click', null);
                fixture.detectChanges();
            });

            it('should create notification on error', () => {
                expect(notificationService.error).toHaveBeenCalledWith(errorMessage);
            });
        });
    });
});
