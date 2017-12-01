import {DebugElement} from "@angular/core";
import {async, ComponentFixture, inject, TestBed} from "@angular/core/testing";
import {Router, ActivatedRoute} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";

import {Observable} from "rxjs/Observable";

import {ActivatedRouteMock} from "../../mocks/activated-route.mock";
import {RouterMock} from "../../mocks/router.mock";
import {RouteFlattenerService} from "../../../../src/app/core/routing/route-flattener.service";
import {EventBusService} from "../../../../src/app/core/events/event-bus.service";
import {RouteLinkProviderService} from "../../../../src/app/core/routing/route-link-provider-service";
import {MigrationProjectService} from "../../../../src/app/project/migration-project.service";
import {MigrationProject} from "../../../../src/app/generated/windup-services";
import {UpdateMigrationProjectEvent, WindupEvent} from "../../../../src/app/core/events/windup-event";
import {ProjectLayoutComponent} from "../../../../src/app/project/project-layout.component";

let comp:    ProjectLayoutComponent;
let fixture: ComponentFixture<ProjectLayoutComponent>;
let de:      DebugElement;
let el:      HTMLElement;

class FinishEvent extends WindupEvent { constructor() { super('finish', null); } }

/**
 * TODO: Fix these tests
 *
 * There is something wrong with them, it completely crashes karma without executing any tests
 * Any line using ProjectLayoutComponent is causing that.
 * Commenting out ProjectLayoutComponent usage solves that problem. There is something wrong with importing it.
 */
xdescribe('ProjectLayoutComponent', () => {
    let activatedRouteMock: ActivatedRouteMock;
    const project: MigrationProject = {
        id: 1,
        version: 1,
        provisional: false,
        title: 'Dummy',
        description: '',
        created: new Date(),
        lastModified: new Date(),
        applications: [],
        executions: [],
        defaultAnalysisContextId: 1
    };

    const routeFlattener = new RouteFlattenerService();
    const eventBus = new EventBusService();

    beforeEach(() => {
        activatedRouteMock = new ActivatedRouteMock();

        TestBed.configureTestingModule({
            imports: [ RouterTestingModule ],
            // TODO: Uncomment line below when problem with karma is fixed
            // declarations: [ ProjectLayoutComponent ],
            providers: [
                {
                    provide: Router,
                    useValue: RouterMock
                },
                {
                    provide: ActivatedRoute,
                    useValue: activatedRouteMock
                },
                {
                    provide: MigrationProjectService,
                    useValue: jasmine.createSpyObj('MigrationProjectService', [
                        'monitorProject',
                        'stopMonitoringProject',
                        'getAll'
                    ])
                },
                {
                    provide: RouteLinkProviderService,
                    useValue: jasmine.createSpyObj('RouteLinkProviderService', [
                        'getRouteForComponent'
                    ])
                },
                {
                    provide: RouteFlattenerService,
                    useValue: routeFlattener
                },
                {
                    provide: EventBusService,
                    useValue: eventBus
                }
            ]

        }).compileComponents();

        // TODO: Uncomment line below when problem with karma is fixed
        //fixture = TestBed.createComponent(ProjectLayoutComponent);
        comp = fixture.componentInstance;

        de = fixture.debugElement;
        el = de.nativeElement;

    });

    it('should load all projects in ngOnInit', async(inject([MigrationProjectService],
        (migrationProjectService) => {
            migrationProjectService.getAll.and.returnValue(
                new Observable<any>(observer => {
                    observer.next([]);
                    observer.complete();
                })
            );

            comp.ngOnInit();

            expect(migrationProjectService.getAll).toHaveBeenCalled();

            fixture.detectChanges();
            // TODO: Check DOM
    })));

    describe('Reading data from route', () => {
        it('should load project', () => {
            const route = new ActivatedRouteMock();
            route.testData = {
                project: project
            };

            comp.ngOnInit();

            routeFlattener.onNewRouteActivated(route as any);
        });
    });

    describe('on event', () => {
        beforeAll(inject([MigrationProjectService],
            (service: MigrationProjectService) => {

                const route = new ActivatedRouteMock();
                route.testData = {
                    project: project
                };

                comp.ngOnInit();

                routeFlattener.onNewRouteActivated(route as any);

                expect(service.monitorProject).toHaveBeenCalledWith(project);
            }));


        it('should ignore event with different project', (done) => {
            const newProject = Object.assign({}, project, { id: 100 });

            expect(comp.project).toEqual(project);

            eventBus.onEvent.filter(event => event.type === 'finish')
                .subscribe(() => {
                    expect(comp.project).toEqual(project);
                    done();
                });

            eventBus.fireEvent(new UpdateMigrationProjectEvent(newProject, this));
            eventBus.fireEvent(new FinishEvent());
        });

        it('should reload project with new data', (done) => {
            const newProject = Object.assign({}, project, { name: 'UpdatedProjectName' });

            expect(comp.project).toEqual(project);

            eventBus.onEvent.filter(event => event.type === 'finish')
                .subscribe(() => {
                    expect(comp.project).toEqual(newProject);
                    done();
                });

            eventBus.fireEvent(new UpdateMigrationProjectEvent(newProject, this));
            eventBus.fireEvent(new FinishEvent());

        });
    });

    describe('project monitoring', () => {
        it('should start monitoring project in onInit', inject([MigrationProjectService],
            (service: MigrationProjectService) => {

            const route = new ActivatedRouteMock();
            route.testData = {
                project: project
            };

            comp.ngOnInit();

            routeFlattener.onNewRouteActivated(route as any);

            expect(service.monitorProject).toHaveBeenCalledWith(project);
        }));

        it('should stop monitoring project in onDestroy', inject([MigrationProjectService],
            (service: MigrationProjectService) => {
            comp.project = project;

            comp.ngOnDestroy();

            expect(service.stopMonitoringProject).toHaveBeenCalledWith(project);
        }));
    });
});

