import {ComponentFixture, TestBed, inject, async} from "@angular/core/testing";
import {DebugElement} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MigrationIssuesService} from "../../../../../src/app/components/reports/migration-issues/migration-issues.service";
import {NotificationService} from "../../../../../src/app/services/notification.service";
import {RouterTestingModule} from "@angular/router/testing";
import {ActivatedRouteMock} from "../../../mocks/activated-route.mock";
import {Observable} from "rxjs";
import {MigrationIssuesComponent} from "../../../../../src/app/components/reports/migration-issues/migration-issues.component";
import {MigrationIssuesTableComponent} from "../../../../../src/app/components/reports/migration-issues/migration-issues-table.component";
import {By} from "@angular/platform-browser";
import {HttpModule, BaseRequestOptions, Http, ConnectionBackend} from "@angular/http";
import {MockBackend} from "@angular/http/testing";

let comp:    MigrationIssuesComponent;
let fixture: ComponentFixture<MigrationIssuesComponent>;
let de:      DebugElement;
let el:      HTMLElement;

describe('MigrationissuesComponent', () => {
    let activatedRouteMock: ActivatedRouteMock;

    beforeEach(() => {
        activatedRouteMock = new ActivatedRouteMock();

        TestBed.configureTestingModule({
            imports: [ RouterTestingModule, HttpModule ],
            declarations: [ MigrationIssuesComponent, MigrationIssuesTableComponent ],
            providers: [
                {
                    provide: Router,
                    useValue: jasmine.createSpyObj('Router', [
                        'navigate'
                    ])
                },
                {
                    provide: ActivatedRoute,
                    useValue: activatedRouteMock
                },
                MockBackend,
                BaseRequestOptions,
                {
                    provide: Http,
                    useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                },
                {
                    provide: MigrationIssuesService,
                    useValue: jasmine.createSpyObj('MigrationIssuesService', [
                        'getAggregatedIssues',
                        'getIssuesPerFile'
                    ])
                },
                {
                    provide: NotificationService,
                    useValue: jasmine.createSpyObj('NotificationService', [
                        'error'
                    ])
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MigrationIssuesComponent);
        comp = fixture.componentInstance;

        de = fixture.debugElement;
        el = de.nativeElement;
    });

    describe('when navigate to non-existing report id', () => {
        beforeEach(async(inject([MigrationIssuesService, MockBackend, Router], (migrationIssuesService: any) => {
            migrationIssuesService.getAggregatedIssues.and.returnValue(
                new Observable<any>(observer => {
                    observer.error({error: 'Report not found'});
                    observer.complete();
                })
            );

            activatedRouteMock.testParams = {executionId: 0};
            fixture.detectChanges();
        })));

        it('should navigate to homepage', async(inject([Router], (router: Router) => {
            expect(router.navigate).toHaveBeenCalledWith(['']);
        })));

        it('should create error message in notification service', async(inject([NotificationService], (notificationService: NotificationService) => {
            expect(notificationService.error).toHaveBeenCalled();
            expect(notificationService.error).toHaveBeenCalledWith('Report not found');
        })));
    });

    describe('when navigate to correct report id', () => {
        let migrationIssuesServiceSpy;

        beforeEach(async(inject([MigrationIssuesService, MockBackend], (migrationIssuesService: any) => {
            migrationIssuesServiceSpy = migrationIssuesService;
            migrationIssuesService.getAggregatedIssues.and.returnValue(
                new Observable<any>(observer => {
                    observer.next(MIGRATION_ISSUES_TEST_DATA);
                    observer.complete();
                })
            );

            activatedRouteMock.testParams = {executionId: 1};
            fixture.detectChanges();
        })));

        it('should get data from migration issues service', () => {
            expect(migrationIssuesServiceSpy.getAggregatedIssues).toHaveBeenCalledWith(1);
        });

        it('should display migration issue tables', () => {
            let migrationIssuesTables = fixture.debugElement.queryAll(By.directive(MigrationIssuesTableComponent));
            expect(migrationIssuesTables.length).toEqual(2);
        });

        it('should display issue category name', () => {
            let categoryNames = fixture.debugElement.queryAll(By.css('h3'));
            let categories = Object.keys(MIGRATION_ISSUES_TEST_DATA);

            expect(categoryNames.length).toEqual(2);
            expect(categoryNames[0].nativeElement.textContent.trim()).toEqual(categories[0]);
            expect(categoryNames[1].nativeElement.textContent.trim()).toEqual(categories[1]);
        });
    });

    describe('when navigate to report without any issues', () => {
        beforeEach(async(inject([MigrationIssuesService, MockBackend], (migrationIssuesService: any) => {
            migrationIssuesService.getAggregatedIssues.and.returnValue(
                new Observable<any>(observer => {
                    let value = {
                        "Mandatory": [],
                        "Optional": []
                    };
                    observer.next(value);
                    observer.complete();
                })
            );

            activatedRouteMock.testParams = {executionId: 1};
            fixture.detectChanges();
        })));

        it('should display "No issues found" text', () => {
            let strongElement = fixture.debugElement.query(By.css('strong'));
            expect(strongElement.nativeElement.textContent.trim()).toEqual("No issues found");
        });
    });
});

const MIGRATION_ISSUES_TEST_DATA = {
    "Mandatory": [
        {
            "id": "e9b8d30d-d747-483f-8918-30d5d4b7f00f",
            "severity": "Mandatory",
            "ruleID": "os-specific-00001",
            "issueName": "Windows file system path",
            "numberFound": 10,
            "effortPerIncident": 1,
            "links": [],
            "descriptions": [
                "This file system path is Windows platform dependent. It needs to be replaced with a Linux-style path."
            ]
        }
    ],
    "Optional": [
        {
            "id": "test-optional",
            "severity": "Optional",
            "ruleID": "os-specific-00002",
            "issueName": "Some test issue",
            "numberFound": 20,
            "effortPerIncident": 10,
            "links": [],
            "descriptions": []
        }
    ]
};
