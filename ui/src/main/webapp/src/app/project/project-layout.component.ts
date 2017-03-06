import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

import {MigrationProject} from "windup-services";
import {RouteLinkProviderService} from "../core/routing/route-link-provider-service";
import {MigrationIssuesComponent} from "../reports/migration-issues/migration-issues.component";
import {TechnologiesReportComponent} from "../reports/technologies/technologies-report.component";
import {DependenciesReportComponent} from "../reports/dependencies/dependencies-report.component";
import {ReportMenuItem} from "../shared/navigation/context-menu-item.class";
import {AnalysisContextFormComponent} from "../analysis-context/analysis-context-form.component";
import {ApplicationIndexComponent} from "../reports/application-index/application-index.component";
import {ApplicationDetailsComponent} from "../reports/application-details/application-details.component";
import {EventBusService} from "../core/events/event-bus.service";
import {AbstractComponent} from "../shared/AbstractComponent";
import {ReportFilterComponent} from "../reports/filter/report-filter.component";
import {WINDUP_WEB} from "../app.module";
import {ProjectExecutionsComponent} from "../executions/project-executions.component";
import {ApplicationListComponent} from "../registered-application/application-list.component";
import {MigrationProjectEvent, UpdateMigrationProjectEvent} from "../core/events/windup-event";
import {MigrationProjectService} from "./migration-project.service";

@Component({
    templateUrl: './project-layout.component.html',
    styles: [
        `:host /deep/ .nav-pf-vertical { top: 82px; }`
    ]
})
export class ProjectLayoutComponent extends AbstractComponent implements OnInit, OnDestroy {
    protected project: MigrationProject;
    protected menuItems;

    // TODO: Execution progress: Project Layout must be updated when execution state changes (is completed)

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _routeLinkProviderService: RouteLinkProviderService,
        private _migrationProjectService: MigrationProjectService,
        private _eventBus: EventBusService
    ) {
        super();
    }

    ngOnInit(): void {
        this.addSubscription(this._eventBus.onEvent.filter(event => event.isTypeOf(UpdateMigrationProjectEvent))
            .subscribe((event: MigrationProjectEvent) => {
                this.project = event.migrationProject;
                this.createContextMenuItems();
        }));

        this._activatedRoute.data.subscribe((data: {project: MigrationProject}) => {
            this.project = data.project;

            this._migrationProjectService.monitorProject(this.project);
            this.createContextMenuItems();
        });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this._migrationProjectService.stopMonitoringProject(this.project);
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
            {
                label: 'Applications',
                link: this._routeLinkProviderService.getRouteForComponent(ApplicationListComponent, {
                    projectId: this.project.id
                }),
                icon: 'fa-cubes',
                isEnabled: true
            },
            {
                label: 'Executions',
                link: this._routeLinkProviderService.getRouteForComponent(ProjectExecutionsComponent, {
                    projectId: this.project.id
                }),
                icon: 'fa-flask',
                isEnabled: true
            },
            {
                label: 'Config',
                link: this._routeLinkProviderService.getRouteForComponent(AnalysisContextFormComponent, {
                    projectId: this.project.id,
                }),
                icon: 'fa-cogs',
                isEnabled: true,
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
                ApplicationDetailsComponent,
                this._routeLinkProviderService,
            ),
            new ReportMenuItem(
                'Issues',
                'fa-exclamation-triangle',
                this.project,
                MigrationIssuesComponent,
                this._routeLinkProviderService,
            ),
            new ReportMenuItem(
                'Application Index',
                'fa-book',
                this.project,
                ApplicationIndexComponent,
                this._routeLinkProviderService,
            ),
        ];

        if (!WINDUP_WEB.config.hideUnfinishedFeatures) {
            let reportFilterMenu = new ReportMenuItem(
                'Report Filter',
                'fa-filter',
                this.project,
                ReportFilterComponent,
                this._routeLinkProviderService
            );

            this.menuItems.splice(4, 0, reportFilterMenu);

            this.menuItems = [ ...this.menuItems,
                new ReportMenuItem(
                    'Technologies',
                    'fa-cubes',
                    this.project,
                    TechnologiesReportComponent,
                    this._routeLinkProviderService,
                ),
                new ReportMenuItem(
                    'Dependencies',
                    'fa-code-fork',
                    this.project,
                    DependenciesReportComponent,
                    this._routeLinkProviderService
                )
            ];
        }
    }
}
