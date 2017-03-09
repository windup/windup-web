import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

import {MigrationProject} from "windup-services";
import {RouteLinkProviderService} from "../core/routing/route-link-provider-service";
import {MigrationIssuesComponent} from "../reports/migration-issues/migration-issues.component";
import {TechnologiesReportComponent} from "../reports/technologies/technologies-report.component";
import {DependenciesReportComponent} from "../reports/dependencies/dependencies-report.component";
import {ReportMenuItem} from "../shared/navigation/context-menu-item.class";
import {ApplicationIndexComponent} from "../reports/application-index/application-index.component";
import {ApplicationDetailsComponent} from "../reports/application-details/application-details.component";
import {AbstractComponent} from "../shared/AbstractComponent";
import {ReportFilterComponent} from "../reports/filter/report-filter.component";
import {WINDUP_WEB} from "../app.module";
import {ProjectExecutionsComponent} from "./project-executions.component";
import {WindupExecution} from "windup-services";
import {WindupService} from "../services/windup.service";
import {EventBusService} from "../core/events/event-bus.service";
import {ExecutionEvent} from "../core/events/windup-event";

@Component({
    templateUrl: './executions-layout.component.html',
    styles: [
        `:host /deep/ .nav-pf-vertical { top: 82px; }`
    ]
})
export class ExecutionsLayoutComponent extends AbstractComponent implements OnInit, OnDestroy {
    protected project: MigrationProject;
    protected execution: WindupExecution;
    protected menuItems;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _routeLinkProviderService: RouteLinkProviderService,
        private _windupService: WindupService,
        private _eventBus: EventBusService,
    ) {
        super();
    }

    ngOnInit(): void {

        this._activatedRoute.parent.data.subscribe((data: {project: MigrationProject}) => {
            this.project = data.project;

            this._activatedRoute.params.subscribe((params: {executionId: number}) => {
                let executionId = +params.executionId;
                this._eventBus.onEvent
                    .filter(event => event.isTypeOf(ExecutionEvent))
                    .filter((event: ExecutionEvent) => event.execution.id === executionId)
                    .subscribe((event: ExecutionEvent) => {
                        this.execution = event.execution;
                        this.createContextMenuItems();
                    });

                this._windupService.getExecution(executionId).subscribe(execution => {
                    this.execution = execution;
                    this.createContextMenuItems();
                });
            });
        });
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
            /*
             {
             label: 'Dashboard',
             link: '/groups/' + this.applicationGroup.id,
             icon: 'fa-tachometer',
             isEnabled: true
             },
             */
            new ReportMenuItem(
                'Application Details',
                'fa-list',
                this.project,
                this.execution,
                ApplicationDetailsComponent,
                this._routeLinkProviderService,
            ),
            new ReportMenuItem(
                'Issues',
                'fa-exclamation-triangle',
                this.project,
                this.execution,
                MigrationIssuesComponent,
                this._routeLinkProviderService,
            ),
            new ReportMenuItem(
                'Application Index',
                'fa-book',
                this.project,
                this.execution,
                ApplicationIndexComponent,
                this._routeLinkProviderService,
            ),
        ];

        if (!WINDUP_WEB.config.hideUnfinishedFeatures) {
            let reportFilterMenu = new ReportMenuItem(
                'Report Filter',
                'fa-filter',
                this.project,
                this.execution,
                ReportFilterComponent,
                this._routeLinkProviderService
            );

            this.menuItems.splice(4, 0, reportFilterMenu);

            this.menuItems = [ ...this.menuItems,
                new ReportMenuItem(
                    'Technologies',
                    'fa-cubes',
                    this.project,
                    this.execution,
                    TechnologiesReportComponent,
                    this._routeLinkProviderService,
                ),
                new ReportMenuItem(
                    'Dependencies',
                    'fa-code-fork',
                    this.project,
                    this.execution,
                    DependenciesReportComponent,
                    this._routeLinkProviderService
                )
            ];
        }
    }
}
