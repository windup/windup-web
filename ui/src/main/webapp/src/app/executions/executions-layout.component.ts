import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {RouteLinkProviderService} from "../core/routing/route-link-provider-service";
import {ReportMenuItem} from "../shared/navigation/context-menu-item.class";
import {WINDUP_WEB} from "../app.module";
import {ProjectExecutionsComponent} from "./project-executions.component";
import {WindupExecution} from "windup-services";
import {WindupService} from "../services/windup.service";
import {EventBusService} from "../core/events/event-bus.service";
import {ExecutionEvent} from "../core/events/windup-event";
import {ProjectLayoutComponent} from "../project/project-layout.component";
import {MigrationProjectService} from "../project/migration-project.service";
import {DatePipe} from "@angular/common";
import {RouteFlattenerService} from "../core/routing/route-flattener.service";

@Component({
    templateUrl: './executions-layout.component.html',
    styles: [
        `:host /deep/ .nav-pf-vertical { top: 61px; }`,
        `:host /deep/ .row-cards-pf:first-child { padding-top: initial; }`
    ]
})
export class ExecutionsLayoutComponent extends ProjectLayoutComponent implements OnInit, OnDestroy {
    protected execution: WindupExecution;
    protected allExecutions: WindupExecution[];

    constructor(
        _router: Router,
        _activatedRoute: ActivatedRoute,
        _routeFlattenerService: RouteFlattenerService,
        _routeLinkProviderService: RouteLinkProviderService,
        _migrationProjectService: MigrationProjectService,
        _eventBus: EventBusService,
        protected _windupService: WindupService,
        protected _datePipe: DatePipe
    ) {
        super(_router, _activatedRoute, _routeFlattenerService, _routeLinkProviderService, _migrationProjectService, _eventBus);
    }

    ngOnInit(): void {
        this.addSubscription(this.flatRouteLoaded.subscribe(flatRoute => {
            this.project = flatRoute.data.project;

            this.loadProjectExecutions();
            this.loadProjects();

            let executionId = +flatRoute.params.executionId;
            this.addSubscription(this._eventBus.onEvent
                .filter(event => event.isTypeOf(ExecutionEvent))
                .filter((event: ExecutionEvent) => event.execution.id === executionId)
                .subscribe((event: ExecutionEvent) => {
                    this.execution = event.execution;
                    this.createContextMenuItems();
                }));

            this.loadSelectedExecution(executionId);
        }));
    }

    protected loadSelectedExecution(executionId: number) {
        let observable = this._windupService.getExecution(executionId);
        observable.subscribe(execution => {
            this.execution = execution;
            this.createContextMenuItems();
        });

        return observable;
    }

    protected loadProjectExecutions() {
        this._windupService.getProjectExecutions(this.project.id).subscribe((executions: WindupExecution[]) => {
            this.allExecutions = executions;
        });
    }

    public getExecutionLabel = (execution: WindupExecution): string => {
        return execution ? this._datePipe.transform(execution.timeStarted, 'short') : '';
    };

    public getExecutionRoute = (execution: WindupExecution): any[] => {
        return execution ? ['/projects', this.project.id, 'reports', execution.id] : null;
    };

    public navigateToExecution = (execution: WindupExecution) => {
        this._router.navigate(this.getExecutionRoute(execution));
    };

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
            new ReportMenuItem(
                'Application Details',
                'fa-list',
                this.project,
                this.execution,
                'application-details'
            ),
            new ReportMenuItem(
                'Issues',
                'fa-exclamation-triangle',
                this.project,
                this.execution,
                'migration-issues'
            ),
            new ReportMenuItem(
                'Application Index',
                'fa-book',
                this.project,
                this.execution,
                'application-index'
            ),
        ];

        if (!WINDUP_WEB.config.hideUnfinishedFeatures) {
            let reportFilterMenu = new ReportMenuItem(
                'Report Filter',
                'fa-filter',
                this.project,
                this.execution,
                'filter'
            );

            this.menuItems.splice(4, 0, reportFilterMenu);

            this.menuItems = [ ...this.menuItems,
                new ReportMenuItem(
                    'Technologies',
                    'fa-cubes',
                    this.project,
                    this.execution,
                    'technologies-report'
                ),
                new ReportMenuItem(
                    'Dependencies',
                    'fa-code-fork',
                    this.project,
                    this.execution,
                    'dependencies'
                )
            ];
        }
    }
}
