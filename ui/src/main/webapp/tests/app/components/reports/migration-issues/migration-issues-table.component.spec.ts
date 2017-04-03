import {MigrationIssuesTableComponent} from "../../../../../src/app/reports/migration-issues/migration-issues-table.component";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {MigrationIssuesService} from "../../../../../src/app/reports/migration-issues/migration-issues.service";
import {EffortLevel, EffortLevelPipe} from "../../../../../src/app/reports/effort-level.enum";
import {NotificationService} from "../../../../../src/app/core/notification/notification.service";
import {RouterTestingModule} from "@angular/router/testing";
import {ActivatedRouteMock} from "../../../mocks/activated-route.mock";
import {Observable} from "rxjs";
import {BaseRequestOptions, Http, ConnectionBackend} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {GraphJSONToModelService} from "../../../../../src/app/services/graph/graph-json-to-model.service";
import {RouteFlattenerService} from "../../../../../src/app/core/routing/route-flattener.service";
import {RouterMock} from "../../../mocks/router.mock";

let comp:    MigrationIssuesTableComponent;
let fixture: ComponentFixture<MigrationIssuesTableComponent>;
let de:      DebugElement;
let el:      HTMLElement;

describe('MigrationissuesTableComponent', () => {
    let migrationIssues: ProblemSummary[];
    let activatedRouteMock: ActivatedRouteMock;
    let routeFlattener: RouteFlattenerService = new RouteFlattenerService();

    beforeEach(() => {
        activatedRouteMock = new ActivatedRouteMock();
        activatedRouteMock.testData = { execution: {id: 1} };

        TestBed.configureTestingModule({
            imports: [ RouterTestingModule ],
            declarations: [ MigrationIssuesTableComponent, EffortLevelPipe, EffortLevel ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: activatedRouteMock
                },
                {
                    provide: Router,
                    useValue: RouterMock
                },
                {
                    provide: RouteFlattenerService,
                    useValue: routeFlattener
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
                NotificationService,
                {
                    provide: GraphJSONToModelService,
                    useFactory: (http: Http) => {
                        return new GraphJSONToModelService<any>(http, null);
                    },
                    deps: [ Http ]
                }
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
                "effortPerIncident": 3,
                "links": [],
                "descriptions": [
                    "This is an Oracle proprietary JDBC type (`oracle.sql.driver.OracleConnection`).\n\nIt should be replaced by standard Java EE JCA, datasource and JDBC types."
                ]
            },
        ];

        comp.migrationIssues = migrationIssues;
        fixture.detectChanges();
        RouterMock.navigationEnd();
        routeFlattener.onNewRouteActivated(<any>activatedRouteMock.snapshot);
    });

    it('should display migration issues', () => {
        de = fixture.debugElement.query(By.css('tr.migration-issue-row'));
        el = de.nativeElement;

        expect(el.children[0].textContent).toEqual(migrationIssues[0].issueName);
        expect(el.children[1].textContent).toEqual(migrationIssues[0].numberFound.toString());
        expect(el.children[2].textContent).toEqual(migrationIssues[0].effortPerIncident.toString());
        expect(el.children[3].textContent).toEqual(EffortLevel[migrationIssues[0].effortPerIncident]);
        expect(el.children[4].textContent).toBe((migrationIssues[0].numberFound * migrationIssues[0].effortPerIncident).toString());
    });

    it('should calculate sum of found migration issues', () => {
        de = fixture.debugElement.query(By.css('th.migration-issues-count'));
        el = de.nativeElement;

        let issuesFound = migrationIssues.map(item => item.numberFound).reduce((previous, current) => {
            return previous + current;
        }, 0);

        expect(el.textContent).toEqual(issuesFound.toString());
    });

    it('should calculate sum of story points', () => {
        de = fixture.debugElement.query(By.css('th.migration-issues-story-points'));
        el = de.nativeElement;

        let storyPoints = migrationIssues.map(item => item.numberFound * item.effortPerIncident).reduce((previous, current) => {
            return previous + current;
        }, 0);

        expect(el.textContent).toEqual(storyPoints.toString());
    });

    it('should not display migration issues files by default', () => {

    });

    describe('after clicking on migration issue title', () => {
        let migrationIssueService;

        beforeEach(() => {
            migrationIssueService = de.injector.get(MigrationIssuesService);
            migrationIssueService.getIssuesPerFile.and.returnValue(new Observable<any>(observer => {
                let data = [
                    {
                        occurrences: 3,
                        file: {
                            fileName: 'SearchOperatorEnum.java'
                        }
                    },
                    {
                        occurrences: 3,
                        file: {
                            fileName: 'SearchOperatorEnumNoPath.java'
                        }
                    },
                    {
                        occurrences: 4,
                        file: {
                            fileName: 'DescriptionDaoImpl.java'
                        }
                    }
                ];

                observer.next(data);
                observer.complete();
            }));

            de = fixture.debugElement.query(By.css('a.issue-title'));
            el = de.nativeElement;

            de.triggerEventHandler('click', null);
            fixture.detectChanges();
        });

        it('should use migration issues service to get file issue data', () => {
            expect(migrationIssueService.getIssuesPerFile).toHaveBeenCalledWith(1, migrationIssues[0], undefined);
        });

        it('should display file issues table', () => {

        });

        describe('after clicking on migration issue title again', () => {
            beforeEach(() => {
                de = fixture.debugElement.query(By.css('a.issue-title'));
                el = de.nativeElement;

                el.click();
                fixture.detectChanges();

                el.click();
                fixture.detectChanges();
            });

            it('should hide file issues table', () => {

            });
        });
    });
});
