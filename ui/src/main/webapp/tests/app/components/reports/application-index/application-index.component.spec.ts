import {ComponentFixture, TestBed, inject, async} from "@angular/core/testing";
import {DebugElement} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {AggregatedStatisticsService} from "../../../../../src/app/reports/application-index/aggregated-statistics.service";
import {NotificationService} from "../../../../../src/app/core/notification/notification.service";
import {ActivatedRouteMock} from "../../../mocks/activated-route.mock";
import {Observable} from "rxjs";
import {ApplicationIndexComponent} from "../../../../../src/app/reports/application-index/application-index.component";
import {PackageChartComponent} from "../../../../../src/app/reports/package-chart/package-chart.component";
import {ReportFilterIndicatorComponent} from "../../../../../src/app/reports/filter/report-filter-indicator.component";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {WindupService} from "../../../../../src/app/services/windup.service";
import {RouterMock} from "../../../mocks/router.mock";
import {RouteFlattenerService} from "../../../../../src/app/core/routing/route-flattener.service";

let comp:    ApplicationIndexComponent;
let fixture: ComponentFixture<ApplicationIndexComponent>;
let de:      DebugElement;
let el:      HTMLElement;


describe('ApplicationIndexComponent', () => {
    let activeRouteMock:ActivatedRouteMock;

    beforeEach(() =>{
        activeRouteMock = new ActivatedRouteMock();

        TestBed.configureTestingModule({
            imports: [ RouterTestingModule, HttpClientTestingModule, NgxChartsModule ],
            declarations: [ ApplicationIndexComponent,
                            ReportFilterIndicatorComponent,
                            PackageChartComponent ],
            providers: [
                {
                    provide: Router,
                    useValue: RouterMock
                },
                {
                    provide: ActivatedRoute,
                    useValue: activeRouteMock
                },
                RouteFlattenerService,                
                {
                    provide: AggregatedStatisticsService,
                    useValue: jasmine.createSpyObj('AggregatedStatisticsService', [
                        'getAggregatedCategories',
                        'getMandatoryIncidents',
                        'getAggregatedJavaPackages',
                        'getAggregatedDependencies',
                        'getAggregatedArchives'
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
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ApplicationIndexComponent);
        comp = fixture.componentInstance;

        de = fixture.debugElement;
        el = de.nativeElement;
    });

    /*describe('when navigate to correct report id', () => {
        let statisticsServiceSpy;

        beforeEach(async(inject([AggregatedStatisticsService], (aggregatedStatsService: any) => {
            statisticsServiceSpy = aggregatedStatsService;
            aggregatedStatsService.getAggregatedCategories.and.returnValue(
                new Observable<any>(observer => {
                    observer.next(CATEGORIES_OF_INCIDENTS);
                    observer.complete();
                })
            );

            aggregatedStatsService.getMandatoryIncidents.and.returnValue(
                new Observable<any>(observer => {
                    observer.next(MANDATORY_INCIDENTS);
                    observer.complete();
                })
            );

            aggregatedStatsService.getAggregatedJavaPackages.and.returnValue(
                new Observable<any>(observer => {
                    observer.next(JAVA_PACKAGES_USAGE);
                    observer.complete();
                })
            );
            activeRouteMock.testParams = {executionId: 1};
            fixture.detectChanges();
        })));

        it('should get data from aggregated statistics service', () => {
            expect(statisticsServiceSpy.getAggregatedCategories).toHaveBeenCalledWith(1);
        });

        it('should display categories table', () => {
            let categoriesStatsTable = fixture.debugElement.queryAll(By.css('#categoriesMultiStats'));
            expect(categoriesStatsTable.length).toEqual(1);
        });

    })*/
});




const CATEGORIES_OF_INCIDENTS = {
        "optional":{"Architectural":0,"Unknown":0,"Trivial":4,"Info":8,"Redesign":0,"Complex":0},
        "mandatory":{"Architectural":0,"Unknown":0,"Trivial":31,"Info":1,"Redesign":0,"Complex":15},
        "potential":{"Architectural":0,"Unknown":0,"Trivial":0,"Info":40,"Redesign":0,"Complex":0}
    };

const MANDATORY_INCIDENTS = {"mandatory":{"Architectural":0,"Unknown":0,"Trivial":31,"Info":0,"Redesign":0,"Complex":17}};

const JAVA_PACKAGES_USAGE ={"weblogic.i18n.*":15,"javax.jms.*":1,"weblogic.common.*":5} 
