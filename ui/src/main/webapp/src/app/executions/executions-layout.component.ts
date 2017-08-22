import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {RouteLinkProviderService} from "../core/routing/route-link-provider-service";
import {ContextMenuItem, ContextMenuItemInterface, ReportMenuItem} from "../shared/navigation/context-menu-item.class";
import {WINDUP_WEB} from "../app.module";
import {WindupExecution} from "../generated/windup-services";
import {WindupService} from "../services/windup.service";
import {EventBusService} from "../core/events/event-bus.service";
import {ExecutionEvent} from "../core/events/windup-event";
import {ProjectLayoutComponent} from "../project/project-layout.component";
import {MigrationProjectService} from "../project/migration-project.service";
import {DatePipe} from "@angular/common";
import {FlattenedRouteData, RouteFlattenerService} from "../core/routing/route-flattener.service";
import {WindupExecutionService} from "../services/windup-execution.service";

@Component({
    templateUrl: './executions-layout.component.html',
})
export class ExecutionsLayoutComponent extends ProjectLayoutComponent implements OnInit, OnDestroy {
    execution: WindupExecution;
    allExecutions: WindupExecution[];

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

    protected loadDataFromRoute(flatRoute: FlattenedRouteData) {
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
            this.allExecutions = executions.sort((a,b) => (a.id||0) - (b.id||0));
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

    get staticReportsAvailable(): boolean {
        if (!this.execution)
            return false;

        if (!this.execution.analysisContext)
            return false;

        return this.execution.analysisContext.generateStaticReports;
    }

    protected createContextMenuItems() {
        this.submenuTechnologyItems = [
            new ContextMenuItem(
                'EJB',
                null,
                true,
                'technology-report-ejb'
            ),
            new ContextMenuItem(
                'JPA',
                null,
                false,
                'technology-report-change-me'
            ),
            new ContextMenuItem(
                'Server Resources',
                null,
                false,
                'technology-report-change-me'
            ),
            new ContextMenuItem(
                'Remote Services',
                null,
                false,
                'technology-report-change-me'
            ),
            new ContextMenuItem(
                'Spring Resources',
                null,
                false,
                'technology-report-change-me'
            ),
            new ContextMenuItem(
                'Hibernate',
                null,
                true,
                'technology-report-hibernate'
            ),
            new ContextMenuItem(
                'Ignored Files',
                null,
                false,
                'technology-report-change-me'
            ),
            new ContextMenuItem(
                'Unparsable Files',
                null,
                false,
                'technology-report-change-me'
            )
        ];
        this.menuItems = [
            new ReportMenuItem(
                'Application List',
                'fa-cubes',
                this.project,
                this.execution,
                ''
            ),
            new ReportMenuItem(
                'Dashboard',
                'fa-book',
                this.project,
                this.execution,
                'application-index'
            ),
            new ReportMenuItem(
                'Technologies',
                'fa-lightbulb-o',
                this.project,
                this.execution,
                'technology-report',
                this.submenuTechnologyItems
            ),
            new ReportMenuItem(
                'Issues',
                'fa-exclamation-triangle',
                this.project,
                this.execution,
                'migration-issues'
            ),
            new ReportMenuItem(
                'Execution Details',
                'fa-cog',
                this.project,
                this.execution,
                'execution-details'
            ),
            new ContextMenuItem(
                'Static Reports',
                'fa-window-restore',
                this.staticReportsAvailable,
                WindupExecutionService.formatStaticReportUrl(this.execution),
                null,
                null,
                '_blank',
                true
            )
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
