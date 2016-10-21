import {MigrationIssuesTableComponent} from "../../../../../src/app/components/reports/migration-issues/migration-issues-table.component";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {MigrationIssuesService} from "../../../../../src/app/components/reports/migration-issues/migration-issues.service";
import {NotificationService} from "../../../../../src/app/services/notification.service";
import {RouterTestingModule} from "@angular/router/testing";
import {ActivatedRouteMock} from "../../../mocks/activated-route.mock";
import {MigrationIssuesServiceMock} from "../../../mocks/migration-issues-service.mock";
import {Observable} from "rxjs";

let comp:    MigrationIssuesTableComponent;
let fixture: ComponentFixture<MigrationIssuesTableComponent>;
let de:      DebugElement;
let el:      HTMLElement;

describe('MigrationissuesComponent', () => {
    let migrationIssues: ProblemSummary[];
    let activatedRouteMock: ActivatedRouteMock;
    let migrationIssuesServiceMock: MigrationIssuesServiceMock;

    beforeEach(() => {
        activatedRouteMock = new ActivatedRouteMock();
        migrationIssuesServiceMock = new MigrationIssuesServiceMock();

        TestBed.configureTestingModule({
            imports: [ RouterTestingModule ],
            declarations: [ MigrationIssuesTableComponent ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: activatedRouteMock
                },
                {
                    provide: MigrationIssuesService,
                    useValue: migrationIssuesServiceMock
                },
                NotificationService
            ]
        });

        fixture = TestBed.createComponent(MigrationIssuesTableComponent);
        comp = fixture.componentInstance;

        de = fixture.debugElement.query(By.css('table.migration-issues-table'));
        el = de.nativeElement;

        migrationIssues = [
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
            },
            {
                "id": "e95949e4-e54b-4e62-b77d-e3b979c61756",
                "severity": "Optional",
                "ruleID": "weblogic-catchall-06500",
                "issueName": "Oracle proprietary JDBC type reference",
                "numberFound": 18,
                "effortPerIncident": 2,
                "links": [],
                "descriptions": [
                    "This is an Oracle proprietary JDBC type (`oracle.sql.driver.OracleConnection`).\n\nIt should be replaced by standard Java EE JCA, datasource and JDBC types."
                ]
            },
        ];

        comp.migrationIssues = migrationIssues;
        //fixture.detectChanges();
    });

    describe('when navigate to non-existing report id', () => {
        let migrationIssuesSpy;

        beforeEach(() => {
            migrationIssuesSpy = spyOn(migrationIssuesServiceMock, 'getAggregatedIssues').and.returnValue(
                new Observable<any>(observer => {
                    observer.error({error: 'Report not found'});
                    observer.complete();
                })
            );

            activatedRouteMock.testParams = {id: 0};
            fixture.detectChanges();
        });

        it('should navigate to homepage', () => {
            let router = de.injector.get(Router);
            let routerSpy = spyOn(router, 'navigate');

            expect(routerSpy).toHaveBeenCalledWith(['']);
        });

        it('should create error message in notification service', () => {
            let notificationService = de.injector.get(NotificationService);
            let notificationSpy = spyOn(notificationService, 'error');

            expect(notificationSpy).toHaveBeenCalled();
            expect(notificationSpy).toHaveBeenCalledWith({error: 'Report not found'});
        });
    });

    describe('when navigate to correct report id', () => {
        let migrationIssuesSpy;

        beforeEach(() => {
            migrationIssuesSpy = spyOn(migrationIssuesServiceMock, 'getAggregatedIssues').and.returnValue(
                new Observable<any>(observer => {
                    let value = {
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
                    observer.next(value);
                    observer.complete();
                })
            );

            activatedRouteMock.testParams = {id: 1};
            fixture.detectChanges();
        });

        it('should get data from migration issues service', () => {
            expect(migrationIssuesSpy).toHaveBeenCalledWith(1);
        });

        it('should display migration issue tables', () => {

        });
    });
});
