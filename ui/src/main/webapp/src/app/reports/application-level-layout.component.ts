import {Component, OnInit} from "@angular/core";
import {ExecutionsLayoutComponent} from "../executions/executions-layout.component";
import {RegisteredApplication} from "windup-services";
import {RouteLinkProviderService} from "../core/routing/route-link-provider-service";
import {WindupService} from "../services/windup.service";
import {EventBusService} from "../core/events/event-bus.service";
import {MigrationProjectService} from "../project/migration-project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {FlattenedRouteData, RouteFlattenerService} from "../core/routing/route-flattener.service";
import {FilterApplication} from "windup-services";
import {ApplicationReportMenuItem} from "../shared/navigation/context-menu-item.class";
import {ProjectExecutionsComponent} from "../executions/project-executions.component";
import {WINDUP_WEB} from "../app.module";

type Application = any; //RegisteredApplication|FilterApplication;

@Component({
    templateUrl: './application-level-layout.component.html'
})
export class ApplicationLevelLayoutComponent extends ExecutionsLayoutComponent {
    public allApplications: (RegisteredApplication|FilterApplication)[];
    public application: RegisteredApplication|FilterApplication;
    protected applicationId: number;

    constructor(
        _router: Router,
        _activatedRoute: ActivatedRoute,
        _routeFlattenerService: RouteFlattenerService,
        _routeLinkProviderService: RouteLinkProviderService,
        _migrationProjectService: MigrationProjectService,
        _eventBus: EventBusService,
        _windupService: WindupService,
        _datePipe: DatePipe
    ) {
        super(
            _router,
            _activatedRoute,
            _routeFlattenerService,
            _routeLinkProviderService,
            _migrationProjectService,
            _eventBus,
            _windupService,
            _datePipe
        );
    }

    protected loadDataFromRoute(flattenedRoute: FlattenedRouteData) {
        this.applicationId = +flattenedRoute.params.applicationId;
        super.loadDataFromRoute(flattenedRoute);
    }

    protected loadSelectedExecution(executionId: number) {
        let observable = super.loadSelectedExecution(executionId);
        observable.subscribe(execution => {
            this.allApplications = execution.filterApplications;
            this.application = this.allApplications.find(app => app.id === this.applicationId);
            this.createContextMenuItems();
        });

        return observable;
    }

    protected createContextMenuItems() {
        this.menuItems = [
            {
                label: 'View Project',
                link: this._routeLinkProviderService.getRouteForComponent(ProjectExecutionsComponent, {
                    projectId: this.project.id
                }),
                icon: 'fa-tachometer',
                isEnabled: true
            },
            new ApplicationReportMenuItem(
                'Dashboard',
                'fa-book',
                this.project,
                this.execution,
                this.application,
                'application-index'
            ),
            new ApplicationReportMenuItem(
                'Application Details',
                'fa-list',
                this.project,
                this.execution,
                this.application,
                'application-details'
            ),
            new ApplicationReportMenuItem(
                'Issues',
                'fa-exclamation-triangle',
                this.project,
                this.execution,
                this.application,
                'migration-issues'
            ),
        ];

        if (!WINDUP_WEB.config.hideUnfinishedFeatures) {
            let reportFilterMenu = new ApplicationReportMenuItem(
                'Report Filter',
                'fa-filter',
                this.project,
                this.execution,
                this.application,
                'filter'
            );

            this.menuItems.splice(4, 0, reportFilterMenu);

            this.menuItems = [ ...this.menuItems,
                new ApplicationReportMenuItem(
                    'Technologies',
                    'fa-cubes',
                    this.project,
                    this.execution,
                    this.application,
                    'technologies-report'
                ),
                new ApplicationReportMenuItem(
                    'Dependencies',
                    'fa-code-fork',
                    this.project,
                    this.execution,
                    this.application,
                    'dependencies'
                )
            ];
        }
    }

    public getApplicationLabel = (application: Application): string => {
        return application ? application.fileName : '';
    };

    public getApplicationRoute = (application: Application): any[] => {
        let executionRoute = this.getExecutionRoute(this.execution);


        return application && executionRoute ?
            executionRoute.concat(['applications', application.id]) :
            null;
    };

    public navigateToApplication = (application: Application) => {
        this._router.navigate(this.getApplicationRoute(application));
    };
}
