import {Component, OnInit} from "@angular/core";
import {ExecutionsLayoutComponent} from "../executions/executions-layout.component";
import {RegisteredApplication} from "windup-services";
import {RouteLinkProviderService} from "../core/routing/route-link-provider-service";
import {WindupService} from "../services/windup.service";
import {EventBusService} from "../core/events/event-bus.service";
import {MigrationProjectService} from "../project/migration-project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {RouteFlattenerService} from "../core/routing/route-flattener.service";
import {FilterApplication} from "windup-services";

type Application = any; //RegisteredApplication|FilterApplication;

@Component({
    templateUrl: './application-level-layout.component.html'
})
export class ApplicationLevelLayoutComponent extends ExecutionsLayoutComponent implements OnInit {
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

    ngOnInit(): void {
        super.ngOnInit();
        this.flatRouteLoaded.subscribe(flatRoute => {
            this.applicationId = +flatRoute.params.applicationId;
        });
    }

    protected loadSelectedExecution(executionId: number) {
        let observable = super.loadSelectedExecution(executionId);
        observable.subscribe(execution => {
            this.allApplications = execution.filterApplications;
            this.application = this.allApplications.find(app => app.id === this.applicationId);
        });

        return observable;
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
