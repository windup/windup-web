import {ComponentFixture, TestBed, inject, async} from "@angular/core/testing";
import {DebugElement} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MigrationIssuesService} from "../../../../../src/app/reports/migration-issues/migration-issues.service";
import {NotificationService} from "../../../../../src/app/core/notification/notification.service";
import {RouterTestingModule} from "@angular/router/testing";
import {ActivatedRouteMock} from "../../../mocks/activated-route.mock";
import {Observable} from "rxjs";
import {MigrationIssuesComponent} from "../../../../../src/app/reports/migration-issues/migration-issues.component";
import {MigrationIssuesTableComponent} from "../../../../../src/app/reports/migration-issues/migration-issues-table.component";
import {By} from "@angular/platform-browser";
import {HttpModule, BaseRequestOptions, Http, ConnectionBackend} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {ReportFilterIndicatorComponent} from "../../../../../src/app/reports/filter/report-filter-indicator.component";
import {GraphJSONToModelService} from "../../../../../src/app/services/graph/graph-json-to-model.service";
import {WindupService} from "../../../../../src/app/services/windup.service";
import {RouteFlattenerService} from "../../../../../src/app/core/routing/route-flattener.service";
import {RouterMock} from "../../../mocks/router.mock";
import {EffortLevelPipe} from "../../../../../src/app/reports/effort-level.enum";

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
            declarations: [ MigrationIssuesComponent, MigrationIssuesTableComponent, ReportFilterIndicatorComponent, EffortLevelPipe ],
            providers: [
                {
                    provide: Router,
                    useValue: RouterMock
                },
                {
                    provide: ActivatedRoute,
                    useValue: activatedRouteMock
                },
                RouteFlattenerService,
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
                },
                {
                    provide: WindupService,
                    useFactory: () => {
                        let mock = jasmine.createSpyObj('WindupService', [
                            'getExecution'
                        ]);

                        mock.getExecution.and.returnValue(new Observable<any>(observer => {
                            observer.next(null);
                            observer.complete();
                        }));

                        return mock;
                    }
                },
                {
                    provide: GraphJSONToModelService,
                    useFactory: (http: Http) => {
                        return new GraphJSONToModelService<any>(http, null);
                    },
                    deps: [ Http ]
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MigrationIssuesComponent);
        comp = fixture.componentInstance;

        de = fixture.debugElement;
        el = de.nativeElement;
    });

    describe('when navigate to correct report id', () => {
        let migrationIssuesServiceSpy;

        beforeEach(async(inject([MigrationIssuesService, RouteFlattenerService], (migrationIssuesService: any, flattener: any) => {
            migrationIssuesServiceSpy = migrationIssuesService;
            migrationIssuesService.getAggregatedIssues.and.returnValue(
                new Observable<any>(observer => {
                    observer.next(MIGRATION_ISSUES_TEST_DATA);
                    observer.complete();
                })
            );

            activatedRouteMock.testData = { execution: {id: 1} };
            fixture.detectChanges(); // init
            RouterMock.navigationEnd(); // resolve route data
            flattener.onNewRouteActivated(<any>activatedRouteMock.snapshot);
            fixture.detectChanges(); // load changes
        })));

        it('should get data from migration issues service', () => {
            expect(migrationIssuesServiceSpy.getAggregatedIssues).toHaveBeenCalledWith(1, undefined);
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
        beforeEach(async(inject([MigrationIssuesService, RouteFlattenerService], (migrationIssuesService: any, flattener: any) => {
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

            activatedRouteMock.testData = { execution: {id: 1} };
            fixture.detectChanges(); // init
            RouterMock.navigationEnd(); // resolve route data
            flattener.onNewRouteActivated(<any>activatedRouteMock.snapshot);
            fixture.detectChanges(); // load changes
        })));

        it('should display "No issues found" text', () => {
            let strongElement = fixture.debugElement.query(By.css('strong.not-found'));
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
